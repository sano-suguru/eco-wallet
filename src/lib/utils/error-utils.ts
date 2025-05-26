/**
 * エラーハンドリングユーティリティ
 *
 * このファイルは、AppError型のエラーを処理するためのユーティリティ関数を提供します。
 * エラーメッセージの国際化、重要度判定、ログ出力などの機能を含みます。
 */

import {
  AppError,
  ErrorSeverity,
  ErrorContext,
  ExtendedError,
} from "@/shared/types/errors";

/**
 * エラーをユーザー向けメッセージに変換
 *
 * @param error - 変換対象のAppError
 * @returns ユーザー向けのエラーメッセージ
 */
export function getErrorMessage(error: AppError): string {
  switch (error.type) {
    // ValidationError
    case "INVALID_EMAIL":
      return "有効なメールアドレスを入力してください";
    case "INVALID_AMOUNT":
      return error.message || "有効な金額を入力してください";
    case "REQUIRED_FIELD":
      return `${error.field}は必須項目です`;
    case "INVALID_FORMAT":
      return `${error.field}の形式が正しくありません。期待される形式: ${error.expected}`;
    case "INVALID_PASSWORD":
      return error.message || "パスワードの形式が正しくありません";
    case "PASSWORD_MISMATCH":
      return "パスワードが一致しません";
    case "INVALID_RANGE":
      return `${error.field}は${error.min}から${error.max}の範囲で入力してください（入力値: ${error.actual}）`;

    // ApiError
    case "NETWORK_ERROR":
      return "ネットワークエラーが発生しました。接続を確認してください。";
    case "SERVER_ERROR":
      return "サーバーエラーが発生しました。しばらく時間をおいて再試行してください。";
    case "TIMEOUT_ERROR":
      return "リクエストがタイムアウトしました。再度お試しください。";
    case "UNAUTHORIZED":
      return "ログインが必要です。再度ログインしてください。";
    case "FORBIDDEN":
      return "この操作を実行する権限がありません。";
    case "NOT_FOUND":
      return error.resource
        ? `${error.resource}が見つかりません`
        : "リソースが見つかりません";
    case "CONFLICT":
      return "競合が発生しました。データを更新してから再試行してください。";
    case "RATE_LIMIT_EXCEEDED":
      return error.retryAfter
        ? `リクエスト制限に達しました。${error.retryAfter}秒後に再試行してください。`
        : "リクエスト制限に達しました。しばらく時間をおいて再試行してください。";
    case "BAD_REQUEST":
      return error.message || "リクエストが正しくありません";

    // BusinessError
    case "INSUFFICIENT_BALANCE":
      return `残高が不足しています。必要額: ¥${error.required.toLocaleString()}、利用可能額: ¥${error.available.toLocaleString()}`;
    case "PAYMENT_FAILED":
      return `決済に失敗しました。理由: ${error.reason}`;
    case "TRANSACTION_LIMIT_EXCEEDED":
      return `${error.limitType === "daily" ? "日次" : error.limitType === "monthly" ? "月次" : "取引"}限度額を超えています。限度額: ¥${error.limit.toLocaleString()}、試行額: ¥${error.attempted.toLocaleString()}`;
    case "CAMPAIGN_NOT_ACTIVE":
      return "このキャンペーンは現在利用できません";
    case "DONATION_LIMIT_EXCEEDED":
      return `寄付限度額を超えています。最大寄付額: ¥${error.maxDonationAmount.toLocaleString()}、要求額: ¥${error.requestedAmount.toLocaleString()}`;
    case "ACCOUNT_SUSPENDED":
      return error.suspendedUntil
        ? `アカウントが${error.suspendedUntil.toLocaleDateString()}まで一時停止されています。理由: ${error.reason}`
        : `アカウントが一時停止されています。理由: ${error.reason}`;
    case "KYC_REQUIRED":
      return `本人確認が必要です。${error.requiredLevel === "basic" ? "基本" : "詳細"}認証を完了してください。`;
    case "CHARGE_MINIMUM_NOT_MET":
      return `最小チャージ額を満たしていません。最小額: ¥${error.minimum.toLocaleString()}、入力額: ¥${error.requested.toLocaleString()}`;
    case "INVALID_QR_CODE":
      return "QRコードが無効です。正しいQRコードを読み込んでください。";
    case "TRANSFER_TO_SELF":
      return "自分自身への送金はできません";

    default:
      // TypeScriptのexhaustive checkのため、この行は実行されないはず
      return "エラーが発生しました";
  }
}

/**
 * エラーの重要度を判定
 *
 * @param error - 判定対象のAppError
 * @returns エラーの重要度レベル
 */
export function getErrorSeverity(error: AppError): ErrorSeverity {
  switch (error.type) {
    // Low severity - ユーザー入力エラー、軽微な問題
    case "INVALID_EMAIL":
    case "INVALID_AMOUNT":
    case "REQUIRED_FIELD":
    case "INVALID_FORMAT":
    case "INVALID_PASSWORD":
    case "PASSWORD_MISMATCH":
    case "INVALID_RANGE":
    case "CHARGE_MINIMUM_NOT_MET":
    case "INVALID_QR_CODE":
    case "TRANSFER_TO_SELF":
      return "low";

    // Medium severity - 一時的な問題、再試行で解決可能
    case "NETWORK_ERROR":
    case "TIMEOUT_ERROR":
    case "NOT_FOUND":
    case "CONFLICT":
    case "BAD_REQUEST":
    case "INSUFFICIENT_BALANCE":
    case "CAMPAIGN_NOT_ACTIVE":
    case "DONATION_LIMIT_EXCEEDED":
    case "TRANSACTION_LIMIT_EXCEEDED":
      return "medium";

    // High severity - 重要な機能の障害、即座の対応が必要
    case "SERVER_ERROR":
    case "PAYMENT_FAILED":
    case "RATE_LIMIT_EXCEEDED":
      return "high";

    // Critical severity - セキュリティ関連、アカウント制限
    case "UNAUTHORIZED":
    case "FORBIDDEN":
    case "ACCOUNT_SUSPENDED":
    case "KYC_REQUIRED":
      return "critical";

    default:
      return "medium";
  }
}

/**
 * エラーが再試行可能かどうかを判定
 *
 * @param error - 判定対象のAppError
 * @returns 再試行可能な場合true
 */
export function isRetryableError(error: AppError): boolean {
  switch (error.type) {
    case "NETWORK_ERROR":
    case "TIMEOUT_ERROR":
    case "SERVER_ERROR":
    case "CONFLICT":
      return true;
    case "RATE_LIMIT_EXCEEDED":
      return true; // 時間をおいて再試行可能
    default:
      return false;
  }
}

/**
 * エラーからHTTPステータスコードを推定
 *
 * @param error - 対象のAppError
 * @returns 対応するHTTPステータスコード
 */
export function getHttpStatusFromError(error: AppError): number {
  switch (error.type) {
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
    case "KYC_REQUIRED":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "RATE_LIMIT_EXCEEDED":
      return 429;
    case "INVALID_EMAIL":
    case "INVALID_AMOUNT":
    case "REQUIRED_FIELD":
    case "INVALID_FORMAT":
    case "INVALID_PASSWORD":
    case "PASSWORD_MISMATCH":
    case "INVALID_RANGE":
    case "CHARGE_MINIMUM_NOT_MET":
    case "INVALID_QR_CODE":
    case "TRANSFER_TO_SELF":
    case "BAD_REQUEST":
      return 400;
    case "SERVER_ERROR":
      return 500;
    case "TIMEOUT_ERROR":
      return 504;
    default:
      return 500;
  }
}

/**
 * エラーコンテキストを作成
 *
 * @param userId - ユーザーID
 * @param transactionId - トランザクションID
 * @param additionalContext - 追加のコンテキスト情報
 * @returns エラーコンテキスト
 */
export function createErrorContext(
  userId?: string,
  transactionId?: string,
  additionalContext?: Partial<ErrorContext>,
): ErrorContext {
  return {
    userId,
    transactionId,
    timestamp: new Date(),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    sessionId:
      typeof window !== "undefined"
        ? sessionStorage.getItem("sessionId") || undefined
        : undefined,
    ...additionalContext,
  };
}

/**
 * 拡張エラー情報を作成
 *
 * @param error - AppError
 * @param context - エラーコンテキスト
 * @param stackTrace - スタックトレース
 * @returns 拡張エラー情報
 */
export function createExtendedError(
  error: AppError,
  context?: ErrorContext,
  stackTrace?: string,
): ExtendedError {
  return {
    error,
    severity: getErrorSeverity(error),
    context: context || createErrorContext(),
    stackTrace,
  };
}

/**
 * エラーをログ出力（開発環境のみ）
 *
 * @param error - AppError
 * @param context - エラーコンテキスト
 */
export function logError(error: AppError, context?: ErrorContext): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const severity = getErrorSeverity(error);
  const message = getErrorMessage(error);
  const extendedError = createExtendedError(error, context);

  console.group(`🚫 Error (${severity.toUpperCase()})`);
  console.error("Message:", message);
  console.error("Error Details:", error);
  console.error("Context:", extendedError.context);

  if (extendedError.stackTrace) {
    console.error("Stack Trace:", extendedError.stackTrace);
  }

  console.groupEnd();
}

/**
 * バリデーションエラーの詳細メッセージを生成
 *
 * @param errors - バリデーションエラーの配列
 * @returns 結合されたエラーメッセージ
 */
export function formatValidationErrors(errors: AppError[]): string {
  const validationErrors = errors.filter((error) =>
    [
      "INVALID_EMAIL",
      "INVALID_AMOUNT",
      "REQUIRED_FIELD",
      "INVALID_FORMAT",
      "INVALID_PASSWORD",
      "PASSWORD_MISMATCH",
      "INVALID_RANGE",
    ].includes(error.type),
  );

  if (validationErrors.length === 0) {
    return "バリデーションエラーが発生しました";
  }

  if (validationErrors.length === 1) {
    return getErrorMessage(validationErrors[0]);
  }

  return `以下のエラーを修正してください:\n${validationErrors
    .map((error, index) => `${index + 1}. ${getErrorMessage(error)}`)
    .join("\n")}`;
}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;

  describe("getErrorMessage", () => {
    test("INVALID_EMAIL returns appropriate message", () => {
      const error = {
        type: "INVALID_EMAIL",
        message: "Invalid email",
        field: "email",
      } as const;
      expect(getErrorMessage(error)).toBe(
        "有効なメールアドレスを入力してください",
      );
    });

    test("INSUFFICIENT_BALANCE returns formatted message with amounts", () => {
      const error = {
        type: "INSUFFICIENT_BALANCE",
        message: "Not enough balance",
        required: 1000,
        available: 500,
      } as const;
      expect(getErrorMessage(error)).toBe(
        "残高が不足しています。必要額: ¥1,000、利用可能額: ¥500",
      );
    });

    test("REQUIRED_FIELD returns field-specific message", () => {
      const error = {
        type: "REQUIRED_FIELD",
        message: "Field required",
        field: "username",
      } as const;
      expect(getErrorMessage(error)).toBe("usernameは必須項目です");
    });
  });

  describe("getErrorSeverity", () => {
    test("validation errors have low severity", () => {
      const error = {
        type: "INVALID_EMAIL",
        message: "Invalid email",
        field: "email",
      } as const;
      expect(getErrorSeverity(error)).toBe("low");
    });

    test("security errors have critical severity", () => {
      const error = {
        type: "UNAUTHORIZED",
        message: "Not authorized",
      } as const;
      expect(getErrorSeverity(error)).toBe("critical");
    });

    test("server errors have high severity", () => {
      const error = {
        type: "SERVER_ERROR",
        message: "Server error",
        statusCode: 500,
      } as const;
      expect(getErrorSeverity(error)).toBe("high");
    });
  });

  describe("isRetryableError", () => {
    test("network errors are retryable", () => {
      const error = {
        type: "NETWORK_ERROR",
        message: "Network failed",
      } as const;
      expect(isRetryableError(error)).toBe(true);
    });

    test("validation errors are not retryable", () => {
      const error = {
        type: "INVALID_EMAIL",
        message: "Invalid email",
        field: "email",
      } as const;
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe("getHttpStatusFromError", () => {
    test("returns correct status codes", () => {
      expect(
        getHttpStatusFromError({
          type: "UNAUTHORIZED",
          message: "Unauthorized",
        }),
      ).toBe(401);
      expect(
        getHttpStatusFromError({ type: "NOT_FOUND", message: "Not found" }),
      ).toBe(404);
      expect(
        getHttpStatusFromError({
          type: "SERVER_ERROR",
          message: "Server error",
          statusCode: 500,
        }),
      ).toBe(500);
    });
  });
}
