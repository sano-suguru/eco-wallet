# Donation 機能

## 概要

`donation` 機能は、環境保全プロジェクトへの寄付に関する機能を提供します。ユーザーが環境保全プロジェクトに寄付を行い、その環境インパクトを追跡できる機能群を含んでいます。

## アーキテクチャ

### 設計方針

- **Container/Presentation パターン**: ビジネスロジックとUI表示を分離
- **型安全性**: TypeScriptの厳密な型チェックを活用
- **再利用性**: 他の機能からも利用可能なモジュラー設計

### ディレクトリ構造

```
src/features/donation/
├── components/           # UIコンポーネント
│   └── DonateInput/     # 寄付入力フォーム関連
│       ├── DonateInputContainer.tsx
│       ├── DonateInputForm.tsx
│       ├── AmountSelector.tsx
│       ├── ProjectInfo.tsx
│       └── index.ts
├── types/               # 型定義
│   └── donation.ts
├── hooks/               # カスタムフック
├── store/               # 状態管理
├── utils/               # ユーティリティ関数
├── data/                # モックデータ・定数
├── index.ts             # 公開API
└── README.md           # このファイル
```

## コンポーネント

### DonateInput

寄付金額の入力と確認を行うコンポーネント群です。

#### DonateInputContainer

- **役割**: 状態管理とビジネスロジック
- **責任**: フォーム状態、バリデーション、データ送信処理
- **Props**:
  - `project: DonationProject` - 寄付対象のプロジェクト
  - `onProceed: (amount: number) => void` - 次のステップへの進行処理

#### DonateInputForm

- **役割**: UI表示のみ（プレゼンテーション）
- **責任**: フォームの見た目とユーザーインタラクション
- **特徴**:
  - 金額入力フィールド
  - クイック選択ボタン
  - プロジェクト情報表示
  - エラーメッセージ表示

#### AmountSelector

- **役割**: 金額のクイック選択UI
- **機能**: よく使われる金額（1,000円、5,000円など）をワンクリックで選択

#### ProjectInfo

- **役割**: プロジェクト詳細情報の表示
- **表示内容**: プロジェクト説明、進捗状況、目標金額等

## 型定義

### DonationProject

```typescript
interface DonationProject {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  imageType?: "forest" | "ocean" | "mountain" | "city";
  organization: string;
  endDate: string;
  impact: {
    forestArea?: number;
    co2Reduction?: number;
    waterSaved?: number;
    beneficiaries?: number;
  };
}
```

### DonationInfo

```typescript
interface DonationInfo {
  projectId: string;
  amount: number;
  donorName?: string;
  message?: string;
  isAnonymous: boolean;
  paymentMethod: "balance" | "credit" | "bank";
}
```

## 使用方法

### 基本的な使用例

```typescript
import { DonateInputContainer, DonationProject } from '@/features/donation';

function MyComponent() {
  const project: DonationProject = {
    // プロジェクトデータ
  };

  const handleProceed = (amount: number) => {
    // 次のステップの処理
  };

  return (
    <DonateInputContainer
      project={project}
      onProceed={handleProceed}
    />
  );
}
```

### 公開API

```typescript
// 型定義
export * from "./types/donation";

// コンポーネント
export {
  DonateInputContainer,
  DonateInputForm,
  AmountSelector,
  ProjectInfo,
} from "./components/DonateInput";
```

## 下位互換性

既存のコンポーネントとの互換性を保つため、以下のブリッジコンポーネントが提供されています：

- `src/components/donation/DonateInput/index.tsx`
- `src/components/donation/DonateProjectInput.tsx`

これらは新しい実装への橋渡しを行い、段階的な移行を可能にします。

## 依存関係

### 内部依存

- `@/features/balance` - 残高情報の取得
- `@/features/eco-impact` - 環境インパクトの計算（将来的に連携予定）

### 外部依存

- `@/components/ui/*` - UIプリミティブ
- `@/lib/utils/*` - ユーティリティ関数
- `zustand` - 状態管理（将来的に使用予定）

## 開発ガイドライン

### コンポーネント作成時の注意点

1. **Container/Presentation分離**: ロジックとUIを明確に分離する
2. **型安全性**: 全てのPropsとStateに適切な型を定義する
3. **再利用性**: 他の機能でも使える汎用的な設計を心がける
4. **テスタビリティ**: ユニットテストが書きやすい構造にする

### ファイル命名規則

- コンポーネント: PascalCase (`DonateInputContainer.tsx`)
- フック: camelCase + use接頭辞 (`useDonation.ts`)
- 型定義: PascalCase (`DonationProject`)
- ユーティリティ: camelCase (`formatDonationAmount.ts`)

## 今後の拡張予定

1. **確認画面コンポーネント**: 寄付内容の確認UI
2. **完了画面コンポーネント**: 寄付完了後のサンクスページ
3. **状態管理**: Zustandを使った寄付フローの状態管理
4. **バリデーション**: より詳細な入力バリデーション
5. **テスト**: コンポーネントとロジックのユニットテスト
