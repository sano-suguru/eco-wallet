import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppError, ErrorSeverity } from "@/shared/types/errors";
import {
  getErrorMessage,
  getErrorSeverity,
  isRetryableError,
  formatValidationErrors,
  logError,
  createErrorContext,
} from "@/lib/utils/error-utils";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: AppError | AppError[] | null;
  className?: string;
  showDetails?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  userId?: string;
  transactionId?: string;
  variant?: "inline" | "banner" | "modal";
  collapsible?: boolean;
}

interface ErrorItemProps {
  error: AppError;
  showDetails: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  userId?: string;
  transactionId?: string;
  variant: "inline" | "banner" | "modal";
}

const severityConfig: Record<
  ErrorSeverity,
  {
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    textColor: string;
    borderColor: string;
    iconColor: string;
  }
> = {
  low: {
    icon: Info,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  medium: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-500",
  },
  high: {
    icon: AlertCircle,
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    iconColor: "text-orange-500",
  },
  critical: {
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
  },
};

const variantStyles = {
  inline: "p-3 text-sm rounded-md",
  banner: "p-4 text-base rounded-lg",
  modal: "p-6 text-base rounded-xl",
};

function ErrorItem({
  error,
  showDetails,
  onRetry,
  retryLabel = "再試行",
  userId,
  transactionId,
  variant,
}: ErrorItemProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const severity = getErrorSeverity(error);
  const message = getErrorMessage(error);
  const canRetry = isRetryableError(error);
  const config = severityConfig[severity];
  const Icon = config.icon;

  // エラーをログ出力
  React.useEffect(() => {
    const context = createErrorContext(userId, transactionId);
    logError(error, context);
  }, [error, userId, transactionId]);

  return (
    <div
      className={cn(
        "flex flex-col border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        variantStyles[variant],
      )}
    >
      <div className="flex items-start">
        <Icon
          className={cn(
            "flex-shrink-0 mt-0.5 mr-3",
            variant === "inline" ? "h-4 w-4" : "h-5 w-5",
            config.iconColor,
          )}
        />

        <div className="flex-1 min-w-0">
          <p className="font-medium break-words">{message}</p>

          {showDetails && (
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className={cn(
                "flex items-center mt-2 text-xs hover:underline focus:outline-none",
                config.textColor,
              )}
            >
              {detailsExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  詳細を非表示
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  詳細を表示
                </>
              )}
            </button>
          )}
        </div>

        {canRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size={variant === "inline" ? "sm" : "default"}
            className={cn(
              "ml-3 flex-shrink-0",
              variant === "inline" && "h-8 px-3 text-xs",
            )}
          >
            <RefreshCw
              className={cn(
                variant === "inline" ? "h-3 w-3" : "h-4 w-4",
                "mr-1",
              )}
            />
            {retryLabel}
          </Button>
        )}
      </div>

      {showDetails && detailsExpanded && (
        <div
          className={cn(
            "mt-3 pt-3 border-t text-xs space-y-2",
            config.borderColor,
            "bg-white bg-opacity-50 -mx-3 -mb-3 px-3 pb-3 rounded-b-md",
          )}
        >
          <div>
            <span className="font-medium">エラータイプ:</span> {error.type}
          </div>
          <div>
            <span className="font-medium">重要度:</span>{" "}
            {severity.toUpperCase()}
          </div>
          {error.type === "INVALID_AMOUNT" &&
            "min" in error &&
            error.min !== undefined && (
              <div>
                <span className="font-medium">最小値:</span> {error.min}
              </div>
            )}
          {error.type === "INVALID_AMOUNT" &&
            "max" in error &&
            error.max !== undefined && (
              <div>
                <span className="font-medium">最大値:</span> {error.max}
              </div>
            )}
          {error.type === "SERVER_ERROR" && (
            <div>
              <span className="font-medium">ステータスコード:</span>{" "}
              {error.statusCode}
            </div>
          )}
          {error.type === "RATE_LIMIT_EXCEEDED" && error.retryAfter && (
            <div>
              <span className="font-medium">再試行可能時間:</span>{" "}
              {error.retryAfter}秒後
            </div>
          )}
          <div>
            <span className="font-medium">再試行可能:</span>{" "}
            {canRetry ? "はい" : "いいえ"}
          </div>
        </div>
      )}
    </div>
  );
}

export function ErrorDisplay({
  error,
  className,
  showDetails = false,
  onRetry,
  retryLabel = "再試行",
  userId,
  transactionId,
  variant = "inline",
  collapsible = false,
}: ErrorDisplayProps) {
  const [collapsed, setCollapsed] = useState(collapsible);

  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];
  const hasMultipleErrors = errors.length > 1;

  // 複数のバリデーションエラーの場合は統合メッセージを表示
  if (
    hasMultipleErrors &&
    errors.every((e) =>
      [
        "INVALID_EMAIL",
        "INVALID_AMOUNT",
        "REQUIRED_FIELD",
        "INVALID_FORMAT",
        "INVALID_PASSWORD",
        "PASSWORD_MISMATCH",
        "INVALID_RANGE",
      ].includes(e.type),
    )
  ) {
    const message = formatValidationErrors(errors);
    const severity = "low";
    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
      <div
        className={cn(
          "flex items-start border",
          config.bgColor,
          config.textColor,
          config.borderColor,
          variantStyles[variant],
          className,
        )}
      >
        <Icon
          className={cn(
            "flex-shrink-0 mt-0.5 mr-3",
            variant === "inline" ? "h-4 w-4" : "h-5 w-5",
            config.iconColor,
          )}
        />
        <div className="flex-1 min-w-0">
          <pre className="font-medium whitespace-pre-wrap break-words font-sans">
            {message}
          </pre>
        </div>
      </div>
    );
  }

  if (collapsible && hasMultipleErrors) {
    return (
      <div className={cn("space-y-2", className)}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center justify-between w-full p-3 text-left border rounded-md",
            "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 focus:outline-none",
          )}
        >
          <span className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
            {errors.length}件のエラーが発生しました
          </span>
          {collapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>

        {!collapsed && (
          <div className="space-y-2">
            {errors.map((err, index) => (
              <ErrorItem
                key={`${err.type}-${index}`}
                error={err}
                showDetails={showDetails}
                onRetry={index === 0 ? onRetry : undefined} // 最初のエラーにのみ再試行ボタンを表示
                retryLabel={retryLabel}
                userId={userId}
                transactionId={transactionId}
                variant={variant}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {errors.map((err, index) => (
        <ErrorItem
          key={`${err.type}-${index}`}
          error={err}
          showDetails={showDetails}
          onRetry={hasMultipleErrors && index > 0 ? undefined : onRetry} // 複数エラーの場合は最初のエラーにのみ再試行ボタン
          retryLabel={retryLabel}
          userId={userId}
          transactionId={transactionId}
          variant={variant}
        />
      ))}
    </div>
  );
}

// Backward compatibility - 既存のErrorMessageコンポーネントの機能を保持
interface LegacyErrorMessageProps {
  message: string | null;
  className?: string;
}

export function ErrorMessage({ message, className }: LegacyErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start p-3 text-sm bg-red-50 text-red-700 rounded-md border border-red-200",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
