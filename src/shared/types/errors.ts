/**
 * Neverthrow導入に伴うエラー型定義
 *
 * このファイルは、アプリケーション全体で使用される統一されたエラー型を定義します。
 * Result<T, E>型のE部分として使用され、型安全なエラーハンドリングを実現します。
 */

/**
 * バリデーションエラー
 * フォーム入力やデータバリデーションで発生するエラー
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
    }
  | {
      type: "INVALID_PASSWORD";
      message: string;
      field: "password";
      requirements?: string[];
    }
  | {
      type: "PASSWORD_MISMATCH";
      message: string;
      fields: ["password", "confirmPassword"];
    }
  | {
      type: "INVALID_RANGE";
      message: string;
      field: string;
      min: number;
      max: number;
      actual: number;
    };

/**
 * APIエラー
 * サーバーとの通信やHTTPリクエストで発生するエラー
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
    }
  | {
      type: "NOT_FOUND";
      message: string;
      resource?: string;
    }
  | {
      type: "CONFLICT";
      message: string;
      conflictingResource?: string;
    }
  | {
      type: "RATE_LIMIT_EXCEEDED";
      message: string;
      retryAfter?: number;
    }
  | {
      type: "BAD_REQUEST";
      message: string;
      validationErrors?: ValidationError[];
    };

/**
 * ビジネスロジックエラー
 * アプリケーション固有のビジネスルールに関するエラー
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
      paymentId?: string;
    }
  | {
      type: "TRANSACTION_LIMIT_EXCEEDED";
      message: string;
      limit: number;
      attempted: number;
      limitType: "daily" | "monthly" | "transaction";
    }
  | {
      type: "CAMPAIGN_NOT_ACTIVE";
      message: string;
      campaignId: string;
      startDate?: Date;
      endDate?: Date;
    }
  | {
      type: "DONATION_LIMIT_EXCEEDED";
      message: string;
      maxDonationAmount: number;
      requestedAmount: number;
    }
  | {
      type: "ACCOUNT_SUSPENDED";
      message: string;
      reason: string;
      suspendedUntil?: Date;
    }
  | {
      type: "KYC_REQUIRED";
      message: string;
      requiredLevel: "basic" | "enhanced";
    }
  | {
      type: "CHARGE_MINIMUM_NOT_MET";
      message: string;
      minimum: number;
      requested: number;
    }
  | {
      type: "INVALID_QR_CODE";
      message: string;
      qrCodeType?: "payment" | "transfer" | "unknown";
    }
  | {
      type: "TRANSFER_TO_SELF";
      message: string;
    };

/**
 * 統合エラー型
 * アプリケーション全体で使用される包括的なエラー型
 */
export type AppError = ValidationError | ApiError | BusinessError;

/**
 * エラー重要度レベル
 * ログやアラートの優先度判定に使用
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * エラーコンテキスト
 * エラー発生時の追加情報
 */
export interface ErrorContext {
  userId?: string;
  transactionId?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  sessionId?: string;
}

/**
 * 拡張エラー情報
 * デバッグやログ用の詳細エラー情報
 */
export interface ExtendedError {
  error: AppError;
  severity: ErrorSeverity;
  context: ErrorContext;
  stackTrace?: string;
}
