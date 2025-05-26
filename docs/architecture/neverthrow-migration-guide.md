# Neverthrow導入ガイド

## 1. 概要と目的

### 1.1 背景

Eco Walletプロジェクトでは、現在エラーハンドリングが`string | null`型による単純な実装となっており、以下の課題があります：

- エラーの型安全性が不十分
- エラーハンドリングのパターンが統一されていない
- 例外処理と正常処理の境界が曖昧
- 非同期処理でのエラーハンドリングが複雑

### 1.2 導入目的

**neverthrow**を導入することで、以下の改善を目指します：

- **型安全性の向上**: `Result<T, E>`による明示的なエラー型
- **エラーハンドリングの統一**: 一貫したパターンによる保守性向上
- **関数型プログラミングの利点**: メソッドチェーンによる宣言的なコード
- **非同期処理の改善**: `ResultAsync<T, E>`による堅牢な非同期エラーハンドリング

### 1.3 期待される効果

- **開発効率の向上**: エラーケースの見落とし防止
- **バグの削減**: コンパイル時のエラーハンドリング強制
- **保守性の向上**: 統一されたエラーハンドリングパターン
- **テスタビリティの向上**: エラーケースのテストが容易

## 2. 技術仕様

### 2.1 neverthrowライブラリの基本概念

#### Result型

```typescript
import { Result, ok, err } from "neverthrow";

// 成功の場合
const success: Result<number, string> = ok(42);

// 失敗の場合
const failure: Result<number, string> = err("エラーメッセージ");
```

#### ResultAsync型（非同期処理）

```typescript
import { ResultAsync, okAsync, errAsync } from "neverthrow";

// 非同期処理の成功
const asyncSuccess: ResultAsync<User, ApiError> = okAsync(user);

// 非同期処理の失敗
const asyncFailure: ResultAsync<User, ApiError> = errAsync(apiError);
```

#### 主要メソッド

- `map`: 成功値の変換
- `mapErr`: エラー値の変換
- `andThen`: 成功時の別のResult処理へのチェーン
- `match`: 成功・失敗の両方を処理
- `unwrapOr`: デフォルト値付きの値取得

### 2.2 プロジェクト固有のエラー型設計

#### 共通エラー型の定義

```typescript
// src/shared/types/errors.ts

/**
 * バリデーションエラー
 */
export type ValidationError =
  | {
      type: "INVALID_EMAIL";
      message: string;
      field: "email";
    }
  | {
      type: "INVALID_AMOUNT";
      message: string;
      field: "amount";
      min?: number;
      max?: number;
    }
  | {
      type: "REQUIRED_FIELD";
      message: string;
      field: string;
    }
  | {
      type: "INVALID_FORMAT";
      message: string;
      field: string;
      expected: string;
    };

/**
 * APIエラー
 */
export type ApiError =
  | {
      type: "NETWORK_ERROR";
      message: string;
      cause?: Error;
    }
  | {
      type: "SERVER_ERROR";
      message: string;
      statusCode: number;
      details?: Record<string, unknown>;
    }
  | {
      type: "TIMEOUT_ERROR";
      message: string;
      timeoutMs: number;
    }
  | {
      type: "UNAUTHORIZED";
      message: string;
    }
  | {
      type: "FORBIDDEN";
      message: string;
    };

/**
 * ビジネスロジックエラー
 */
export type BusinessError =
  | {
      type: "INSUFFICIENT_BALANCE";
      message: string;
      required: number;
      available: number;
    }
  | {
      type: "PAYMENT_FAILED";
      message: string;
      reason: string;
    }
  | {
      type: "TRANSACTION_LIMIT_EXCEEDED";
      message: string;
      limit: number;
      attempted: number;
    };

/**
 * 統合エラー型
 */
export type AppError = ValidationError | ApiError | BusinessError;
```

#### エラーハンドリングユーティリティ

```typescript
// src/lib/utils/error-utils.ts
import { AppError } from "@/shared/types/errors";

/**
 * エラーをユーザー向けメッセージに変換
 */
export function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case "INVALID_EMAIL":
      return "有効なメールアドレスを入力してください";
    case "INVALID_AMOUNT":
      return error.message;
    case "REQUIRED_FIELD":
      return `${error.field}は必須項目です`;
    case "NETWORK_ERROR":
      return "ネットワークエラーが発生しました。接続を確認してください。";
    case "SERVER_ERROR":
      return "サーバーエラーが発生しました。しばらく時間をおいて再試行してください。";
    case "INSUFFICIENT_BALANCE":
      return `残高が不足しています。必要額: ¥${error.required.toLocaleString()}、利用可能額: ¥${error.available.toLocaleString()}`;
    default:
      return "エラーが発生しました";
  }
}

/**
 * エラーの重要度を判定
 */
export function getErrorSeverity(
  error: AppError,
): "low" | "medium" | "high" | "critical" {
  switch (error.type) {
    case "INVALID_EMAIL":
    case "INVALID_AMOUNT":
    case "REQUIRED_FIELD":
    case "INVALID_FORMAT":
      return "low";
    case "NETWORK_ERROR":
    case "TIMEOUT_ERROR":
      return "medium";
    case "SERVER_ERROR":
    case "PAYMENT_FAILED":
      return "high";
    case "UNAUTHORIZED":
    case "FORBIDDEN":
      return "critical";
    default:
      return "medium";
  }
}
```

### 2.3 導入パターンとベストプラクティス

#### パターン1: バリデーション関数

```typescript
// Before
export function validateAmount(amount: string): {
  isValid: boolean;
  reason?: string;
} {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, reason: "有効な金額を入力してください" };
  }
  return { isValid: true };
}

// After
export function validateAmount(
  amount: string,
): Result<number, ValidationError> {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return err({
      type: "INVALID_AMOUNT",
      message: "有効な金額を入力してください",
      field: "amount",
    });
  }
  return ok(numAmount);
}
```

#### パターン2: API呼び出し

```typescript
// Before
async function fetchUserBalance(userId: string): Promise<number> {
  try {
    const response = await fetch(`/api/users/${userId}/balance`);
    if (!response.ok) {
      throw new Error("Failed to fetch balance");
    }
    const data = await response.json();
    return data.balance;
  } catch (error) {
    throw error;
  }
}

// After
function fetchUserBalance(userId: string): ResultAsync<number, ApiError> {
  return ResultAsync.fromPromise(
    fetch(`/api/users/${userId}/balance`).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.balance;
    }),
    (error) => ({
      type: "NETWORK_ERROR",
      message: "Failed to fetch user balance",
      cause: error instanceof Error ? error : new Error(String(error)),
    }),
  );
}
```

#### パターン3: ビジネスロジック

```typescript
// Before
function processPayment(amount: number, balance: number): boolean {
  if (balance < amount) {
    throw new Error("Insufficient balance");
  }
  // 支払い処理
  return true;
}

// After
function processPayment(
  amount: number,
  balance: number,
): Result<void, BusinessError> {
  if (balance < amount) {
    return err({
      type: "INSUFFICIENT_BALANCE",
      message: "残高が不足しています",
      required: amount,
      available: balance,
    });
  }
  // 支払い処理
  return ok(undefined);
}
```

## 3. 段階的導入計画

### Phase 1: 基盤整備 (推定工数: 2-3日)

#### 3.1.1 パッケージインストール

```bash
npm install neverthrow
```

#### 3.1.2 基盤ファイルの作成

- [ ] `src/shared/types/errors.ts` - エラー型定義
- [ ] `src/lib/utils/error-utils.ts` - エラーハンドリングユーティリティ
- [ ] `src/lib/utils/result-utils.ts` - Result型ユーティリティ

#### 3.1.3 バリデーション関数の改修

- [ ] `src/lib/utils/validation.ts` - 既存関数をResult型に変更
- [ ] 新しいバリデーション関数の追加

#### 3.1.4 成功条件

- [ ] 全てのバリデーション関数がResult型を返す
- [ ] 型エラーが発生しない
- [ ] 既存テストが通る（アダプター関数使用）

### Phase 2: ビジネスロジック層の改修 (推定工数: 5-7日)

#### 3.2.1 API関数の改修

- [ ] `src/services/api/` - 全API関数をResultAsync型に変更
- [ ] `src/services/mock/` - モック関数の対応

#### 3.2.2 ビジネスロジック関数の改修

- [ ] 決済処理関数
- [ ] 残高管理関数
- [ ] トランザクション処理関数

#### 3.2.3 状態管理の改修

- [ ] Zustandストアでのエラーハンドリング統一
- [ ] 非同期アクションの改修

#### 3.2.4 成功条件

- [ ] 全てのAPI関数がResultAsync型を返す
- [ ] エラーハンドリングが統一されている
- [ ] 非同期処理のエラーが適切に処理される

### Phase 3: UI層の改修 (推定工数: 3-5日)

#### 3.3.1 フォームコンポーネントの改修

- [ ] `ChargeInputContainer` - Result型の利用
- [ ] `PaymentMethodSelector` - エラーハンドリング統一
- [ ] その他フォームコンポーネント

#### 3.3.2 エラー表示コンポーネントの統一

- [ ] 統一されたエラー表示コンポーネント作成
- [ ] エラーメッセージの国際化対応

#### 3.3.3 成功条件

- [ ] 全てのフォームでResult型が活用されている
- [ ] エラー表示が統一されている
- [ ] ユーザビリティが向上している

## 4. 実装ガイドライン

### 4.1 コード変換パターン集

#### パターン1: 単純な戻り値変換

```typescript
// Before
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// After
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("Division by zero");
  }
  return ok(a / b);
}
```

#### パターン2: 複数のバリデーション

```typescript
// Before
function validateUser(user: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!user.email) errors.push("Email is required");
  if (!user.name) errors.push("Name is required");
  return { isValid: errors.length === 0, errors };
}

// After
import { Result, combine } from "neverthrow";

function validateUser(user: any): Result<User, ValidationError[]> {
  const emailResult = user.email
    ? ok(user.email)
    : err({
        type: "REQUIRED_FIELD",
        message: "Email is required",
        field: "email",
      });

  const nameResult = user.name
    ? ok(user.name)
    : err({
        type: "REQUIRED_FIELD",
        message: "Name is required",
        field: "name",
      });

  return Result.combineWithAllErrors([emailResult, nameResult]).map(
    ([email, name]) => ({ email, name }),
  );
}
```

#### パターン3: 非同期処理のチェーン

```typescript
// Before
async function processUserRegistration(userData: any) {
  try {
    const validatedUser = validateUser(userData);
    const savedUser = await saveUser(validatedUser);
    const emailSent = await sendWelcomeEmail(savedUser.email);
    return { user: savedUser, emailSent };
  } catch (error) {
    throw error;
  }
}

// After
function processUserRegistration(
  userData: any,
): ResultAsync<{ user: User; emailSent: boolean }, AppError> {
  return validateUser(userData)
    .asyncAndThen(saveUser)
    .andThen((user) =>
      sendWelcomeEmail(user.email).map((emailSent) => ({ user, emailSent })),
    );
}
```

### 4.2 移行時のベストプラクティス

#### 4.2.1 段階的移行

- 新しい機能から始める
- 既存機能は安定性を優先
- アダプター関数で互換性を保つ

#### 4.2.2 型安全性の確保

- `any`型の使用を避ける
- エラー型を明示的に定義
- ジェネリクスを活用する

#### 4.2.3 パフォーマンス配慮

- 不要なResultオブジェクトの生成を避ける
- メモ化が必要な場合は適切に実装
- 大量データ処理では注意深く設計

### 4.3 テスト戦略

#### 4.3.1 単体テスト

```typescript
// バリデーション関数のテスト例
describe("validateAmount", () => {
  test("valid amount returns Ok", () => {
    const result = validateAmount("100");
    expect(result.isOk()).toBe(true);
    expect(result.unwrapOr(0)).toBe(100);
  });

  test("invalid amount returns Err", () => {
    const result = validateAmount("invalid");
    expect(result.isErr()).toBe(true);
    expect(result.mapErr((e) => e.type).unwrapErr()).toBe("INVALID_AMOUNT");
  });
});
```

#### 4.3.2 統合テスト

```typescript
// API関数のテスト例
describe("fetchUserBalance", () => {
  test("successful API call returns Ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ balance: 1000 }),
    });

    const result = await fetchUserBalance("user-123");
    expect(result.isOk()).toBe(true);
    expect(result.unwrapOr(0)).toBe(1000);
  });

  test("failed API call returns Err", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchUserBalance("user-123");
    expect(result.isErr()).toBe(true);
    expect(result.mapErr((e) => e.type).unwrapErr()).toBe("NETWORK_ERROR");
  });
});
```

## 5. トラブルシューティング

### 5.1 よくある問題と解決策

#### 問題1: 型エラーが頻発する

**原因**: Result型とPromise型の混在
**解決策**: ResultAsyncを適切に使用し、型定義を見直す

#### 問題2: パフォーマンスが低下する

**原因**: 不要なResultオブジェクトの生成
**解決策**: 適切な場所でのResult使用、メモ化の検討

#### 問題3: 既存コードとの統合が困難

**原因**: 移行戦略の不備
**解決策**: アダプター関数の活用、段階的移行の徹底

### 5.2 デバッグ手法

#### Result型のデバッグ

```typescript
// デバッグ用ユーティリティ
function debugResult<T, E>(result: Result<T, E>, label: string): Result<T, E> {
  result.match(
    (value) => console.log(`${label} - Ok:`, value),
    (error) => console.log(`${label} - Err:`, error),
  );
  return result;
}

// 使用例
const result = validateAmount(input)
  .map(debugResult("after validation"))
  .andThen(processAmount)
  .map(debugResult("after processing"));
```

## 6. リファレンス

### 6.1 neverthrow公式ドキュメント

- [GitHub Repository](https://github.com/supermacro/neverthrow)
- [NPM Package](https://www.npmjs.com/package/neverthrow)

### 6.2 関連する型定義

- `Result<T, E>`: 成功時T、失敗時Eの結果型
- `ResultAsync<T, E>`: 非同期版のResult型
- `Ok<T>`: 成功を表すResult型
- `Err<E>`: 失敗を表すResult型

### 6.3 主要メソッド一覧

- `ok(value)`: 成功のResultを作成
- `err(error)`: 失敗のResultを作成
- `map(fn)`: 成功値を変換
- `mapErr(fn)`: エラー値を変換
- `andThen(fn)`: 成功時に別のResultを返す関数を実行
- `match(okFn, errFn)`: 成功・失敗の両方を処理
- `unwrapOr(defaultValue)`: 値を取得（失敗時はデフォルト値）

---

**最終更新**: 2025/01/25
**作成者**: Development Team
**レビュー者**: [未定]
