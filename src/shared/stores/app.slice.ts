/**
 * アプリケーション共通状態管理ストア（Result型対応）
 */

import { create } from "zustand";
import { Result, ok, err } from "neverthrow";
import { AppError, BusinessError, ErrorSeverity } from "../types/errors";
import {
  getErrorMessage,
  getErrorSeverity,
  isRetryableError,
} from "@/lib/utils/error-utils";

/**
 * アプリケーション通知の型定義（AppError対応）
 */
export interface AppNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  // AppError情報
  error?: AppError;
  severity?: ErrorSeverity;
  canRetry?: boolean;
}

/**
 * グローバルローディング状態の型定義
 */
export interface LoadingState {
  [key: string]: boolean;
}

/**
 * アプリケーション共通状態の型定義
 */
export interface AppState {
  // 通知管理
  notifications: AppNotification[];

  // グローバルローディング状態
  loading: LoadingState;

  // グローバルエラー状態
  globalError: AppError | null;

  // アプリケーション設定
  settings: {
    theme: "light" | "dark" | "system";
    language: string;
    debugMode: boolean;
  };

  // 通知管理アクション（Result型対応）
  addNotification: (
    notification: Omit<AppNotification, "id" | "timestamp">,
  ) => Result<string, BusinessError>;
  removeNotification: (id: string) => Result<void, BusinessError>;
  clearNotifications: () => void;

  // ローディング状態管理（Result型対応）
  setLoading: (key: string, loading: boolean) => Result<void, BusinessError>;
  getLoading: (key: string) => Result<boolean, BusinessError>;
  clearLoading: () => void;

  // エラー管理（Result型対応）
  setGlobalError: (error: AppError | null) => Result<void, BusinessError>;
  clearGlobalError: () => void;

  // 設定管理（Result型対応）
  updateSettings: (
    settings: Partial<AppState["settings"]>,
  ) => Result<void, BusinessError>;
  resetSettings: () => void;

  // ユーティリティ
  isAnyLoading: () => boolean;
  getActiveNotificationsCount: () => number;
}

/**
 * アプリケーション共通状態管理ストア（Result型対応）
 */
export const useAppStore = create<AppState>((set, get) => ({
  // 初期状態
  notifications: [],
  loading: {},
  globalError: null,
  settings: {
    theme: "system",
    language: "ja",
    debugMode: process.env.NODE_ENV === "development",
  },

  // 通知を追加（Result型対応）
  addNotification: (notification) => {
    try {
      if (!notification.title || notification.title.trim() === "") {
        return err({
          type: "PAYMENT_FAILED",
          message: "通知タイトルは必須です",
          reason: `空のタイトル: ${notification.title}`,
          paymentId: undefined,
        });
      }

      const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: AppNotification = {
        ...notification,
        id,
        timestamp: new Date(),
        duration: notification.duration ?? 5000,
      };

      set((state) => ({
        notifications: [...state.notifications, newNotification],
      }));

      // 自動削除の設定
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          get().removeNotification(id);
        }, newNotification.duration);
      }

      return ok(id);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "通知の追加に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 通知を削除（Result型対応）
  removeNotification: (id) => {
    try {
      if (!id || id.trim() === "") {
        return err({
          type: "PAYMENT_FAILED",
          message: "通知IDが無効です",
          reason: `空のID: ${id}`,
          paymentId: undefined,
        });
      }

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));

      return ok(undefined);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "通知の削除に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 全通知をクリア
  clearNotifications: () => {
    set({ notifications: [] });
  },

  // ローディング状態を設定（Result型対応）
  setLoading: (key, loading) => {
    try {
      if (!key || key.trim() === "") {
        return err({
          type: "PAYMENT_FAILED",
          message: "ローディングキーが無効です",
          reason: `空のキー: ${key}`,
          paymentId: undefined,
        });
      }

      set((state) => ({
        loading: {
          ...state.loading,
          [key]: loading,
        },
      }));

      return ok(undefined);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "ローディング状態の設定に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // ローディング状態を取得（Result型対応）
  getLoading: (key) => {
    try {
      if (!key || key.trim() === "") {
        return err({
          type: "PAYMENT_FAILED",
          message: "ローディングキーが無効です",
          reason: `空のキー: ${key}`,
          paymentId: undefined,
        });
      }

      const loading = get().loading[key] || false;
      return ok(loading);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "ローディング状態の取得に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // ローディング状態をクリア
  clearLoading: () => {
    set({ loading: {} });
  },

  // グローバルエラーを設定（Result型対応）
  setGlobalError: (error) => {
    try {
      set({ globalError: error });
      return ok(undefined);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "グローバルエラーの設定に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // グローバルエラーをクリア
  clearGlobalError: () => {
    set({ globalError: null });
  },

  // 設定を更新（Result型対応）
  updateSettings: (newSettings) => {
    try {
      if (!newSettings || typeof newSettings !== "object") {
        return err({
          type: "PAYMENT_FAILED",
          message: "設定データが無効です",
          reason: `無効な設定: ${JSON.stringify(newSettings)}`,
          paymentId: undefined,
        });
      }

      set((state) => ({
        settings: {
          ...state.settings,
          ...newSettings,
        },
      }));

      return ok(undefined);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "設定の更新に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 設定をリセット
  resetSettings: () => {
    set({
      settings: {
        theme: "system",
        language: "ja",
        debugMode: process.env.NODE_ENV === "development",
      },
    });
  },

  // いずれかのローディング状態が有効かチェック
  isAnyLoading: () => {
    const loading = get().loading;
    return Object.values(loading).some((isLoading) => isLoading);
  },

  // アクティブな通知数を取得
  getActiveNotificationsCount: () => {
    return get().notifications.length;
  },
}));

// 便利な通知作成ヘルパー関数
export const createSuccessNotification = (
  title: string,
  message?: string,
): Omit<AppNotification, "id" | "timestamp"> => ({
  type: "success",
  title,
  message,
  duration: 3000,
});

export const createErrorNotification = (
  title: string,
  message?: string,
  error?: AppError,
): Omit<AppNotification, "id" | "timestamp"> => ({
  type: "error",
  title,
  message: message || (error ? getErrorMessage(error) : undefined),
  duration: 8000,
  error,
  severity: error ? getErrorSeverity(error) : "high",
  canRetry: error ? isRetryableError(error) : false,
});

export const createWarningNotification = (
  title: string,
  message?: string,
): Omit<AppNotification, "id" | "timestamp"> => ({
  type: "warning",
  title,
  message,
  duration: 5000,
});

export const createInfoNotification = (
  title: string,
  message?: string,
): Omit<AppNotification, "id" | "timestamp"> => ({
  type: "info",
  title,
  message,
  duration: 4000,
});

/**
 * AppError型から適切な通知を自動生成
 */
export const createAppErrorNotification = (
  error: AppError,
  customTitle?: string,
  customMessage?: string,
): Omit<AppNotification, "id" | "timestamp"> => {
  const severity = getErrorSeverity(error);
  const message = customMessage || getErrorMessage(error);
  const canRetry = isRetryableError(error);

  // 重要度に基づいてタイプと期間を決定
  const getTypeAndDuration = (severity: ErrorSeverity) => {
    switch (severity) {
      case "low":
        return { type: "info" as const, duration: 4000 };
      case "medium":
        return { type: "warning" as const, duration: 6000 };
      case "high":
        return { type: "error" as const, duration: 8000 };
      case "critical":
        return { type: "error" as const, duration: 12000 };
      default:
        return { type: "error" as const, duration: 8000 };
    }
  };

  const { type, duration } = getTypeAndDuration(severity);

  // カスタムタイトルがない場合はエラータイプから生成
  const title = customTitle || getDefaultErrorTitle(error);

  return {
    type,
    title,
    message,
    duration,
    error,
    severity,
    canRetry,
  };
};

/**
 * エラータイプから適切なタイトルを生成
 */
const getDefaultErrorTitle = (error: AppError): string => {
  switch (error.type) {
    // ValidationError
    case "INVALID_EMAIL":
    case "INVALID_AMOUNT":
    case "REQUIRED_FIELD":
    case "INVALID_FORMAT":
    case "INVALID_PASSWORD":
    case "PASSWORD_MISMATCH":
    case "INVALID_RANGE":
      return "入力エラー";

    // ApiError
    case "NETWORK_ERROR":
      return "ネットワークエラー";
    case "SERVER_ERROR":
      return "サーバーエラー";
    case "TIMEOUT_ERROR":
      return "タイムアウトエラー";
    case "UNAUTHORIZED":
      return "認証エラー";
    case "FORBIDDEN":
      return "アクセス権限エラー";
    case "NOT_FOUND":
      return "リソースが見つかりません";
    case "CONFLICT":
      return "データ競合エラー";
    case "RATE_LIMIT_EXCEEDED":
      return "リクエスト制限";
    case "BAD_REQUEST":
      return "リクエストエラー";

    // BusinessError
    case "INSUFFICIENT_BALANCE":
      return "残高不足";
    case "PAYMENT_FAILED":
      return "決済エラー";
    case "TRANSACTION_LIMIT_EXCEEDED":
      return "取引限度額超過";
    case "CAMPAIGN_NOT_ACTIVE":
      return "キャンペーンエラー";
    case "DONATION_LIMIT_EXCEEDED":
      return "寄付限度額超過";
    case "ACCOUNT_SUSPENDED":
      return "アカウント停止";
    case "KYC_REQUIRED":
      return "本人確認が必要";
    case "CHARGE_MINIMUM_NOT_MET":
      return "チャージエラー";
    case "INVALID_QR_CODE":
      return "QRコードエラー";
    case "TRANSFER_TO_SELF":
      return "送金エラー";

    default:
      return "エラーが発生しました";
  }
};

/**
 * 複数のAppErrorから通知を一括作成
 */
export const createMultipleAppErrorNotifications = (
  errors: AppError[],
  customTitle?: string,
): Omit<AppNotification, "id" | "timestamp">[] => {
  if (errors.length === 0) return [];

  // 単一エラーの場合
  if (errors.length === 1) {
    return [createAppErrorNotification(errors[0], customTitle)];
  }

  // 複数エラーの場合は重要度で統合
  const highestSeverity = errors.reduce((highest, error) => {
    const severity = getErrorSeverity(error);
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    return severityOrder[severity] > severityOrder[highest]
      ? severity
      : highest;
  }, "low" as ErrorSeverity);

  const errorMessages = errors.map((error) => getErrorMessage(error));
  const combinedMessage = `以下のエラーが発生しました:\n${errorMessages.map((msg, index) => `${index + 1}. ${msg}`).join("\n")}`;

  const { type, duration } = (() => {
    switch (highestSeverity) {
      case "low":
        return { type: "info" as const, duration: 6000 };
      case "medium":
        return { type: "warning" as const, duration: 8000 };
      case "high":
        return { type: "error" as const, duration: 10000 };
      case "critical":
        return { type: "error" as const, duration: 15000 };
      default:
        return { type: "error" as const, duration: 10000 };
    }
  })();

  return [
    {
      type,
      title: customTitle || `${errors.length}件のエラーが発生しました`,
      message: combinedMessage,
      duration,
      severity: highestSeverity,
      canRetry: errors.some(isRetryableError),
    },
  ];
};

/**
 * AppStoreと連携した便利な通知関数
 */
export const showAppErrorNotification = (
  error: AppError,
  customTitle?: string,
  customMessage?: string,
): Result<string, BusinessError> => {
  const notification = createAppErrorNotification(
    error,
    customTitle,
    customMessage,
  );
  return useAppStore.getState().addNotification(notification);
};

export const showMultipleAppErrorNotifications = (
  errors: AppError[],
  customTitle?: string,
): Result<string[], BusinessError> => {
  const notifications = createMultipleAppErrorNotifications(
    errors,
    customTitle,
  );
  const results = notifications.map((notification) =>
    useAppStore.getState().addNotification(notification),
  );

  // すべて成功した場合のみ成功とする
  const failedResults = results.filter((result) => result.isErr());
  if (failedResults.length > 0) {
    return err(failedResults[0]._unsafeUnwrapErr());
  }

  return ok(results.map((result) => result._unsafeUnwrap()));
};

// In Source Testing
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest;

  describe("AppStore", () => {
    beforeEach(() => {
      // ストアをリセット
      useAppStore.setState({
        notifications: [],
        loading: {},
        globalError: null,
        settings: {
          theme: "system",
          language: "ja",
          debugMode: false,
        },
      });
    });

    describe("addNotification", () => {
      it("有効な通知を追加できる", () => {
        const notification = {
          type: "success" as const,
          title: "テスト通知",
          message: "テストメッセージ",
        };

        const result = useAppStore.getState().addNotification(notification);
        expect(result.isOk()).toBe(true);

        const notificationId = result._unsafeUnwrap();
        expect(typeof notificationId).toBe("string");
        expect(useAppStore.getState().notifications).toHaveLength(1);
      });

      it("タイトルが空の場合、エラーを返す", () => {
        const notification = {
          type: "success" as const,
          title: "",
          message: "テストメッセージ",
        };

        const result = useAppStore.getState().addNotification(notification);
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
      });
    });

    describe("removeNotification", () => {
      it("通知を削除できる", () => {
        const addResult = useAppStore.getState().addNotification({
          type: "info",
          title: "テスト通知",
        });
        const notificationId = addResult._unsafeUnwrap();

        const removeResult = useAppStore
          .getState()
          .removeNotification(notificationId);
        expect(removeResult.isOk()).toBe(true);
        expect(useAppStore.getState().notifications).toHaveLength(0);
      });

      it("無効なIDの場合、エラーを返す", () => {
        const result = useAppStore.getState().removeNotification("");
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
      });
    });

    describe("setLoading", () => {
      it("ローディング状態を設定できる", () => {
        const result = useAppStore.getState().setLoading("test-key", true);
        expect(result.isOk()).toBe(true);
        expect(useAppStore.getState().loading["test-key"]).toBe(true);
      });

      it("無効なキーの場合、エラーを返す", () => {
        const result = useAppStore.getState().setLoading("", true);
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
      });
    });

    describe("getLoading", () => {
      it("ローディング状態を取得できる", () => {
        useAppStore.getState().setLoading("test-key", true);

        const result = useAppStore.getState().getLoading("test-key");
        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap()).toBe(true);
      });

      it("存在しないキーの場合、falseを返す", () => {
        const result = useAppStore.getState().getLoading("non-existent");
        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap()).toBe(false);
      });
    });

    describe("updateSettings", () => {
      it("設定を更新できる", () => {
        const result = useAppStore.getState().updateSettings({
          theme: "dark",
          language: "en",
        });

        expect(result.isOk()).toBe(true);
        expect(useAppStore.getState().settings.theme).toBe("dark");
        expect(useAppStore.getState().settings.language).toBe("en");
      });

      it("無効な設定の場合、エラーを返す", () => {
        const result = useAppStore
          .getState()
          .updateSettings(null as unknown as Partial<AppState["settings"]>);
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
      });
    });

    describe("isAnyLoading", () => {
      it("ローディング状態がない場合、falseを返す", () => {
        expect(useAppStore.getState().isAnyLoading()).toBe(false);
      });

      it("いずれかのローディング状態がtrueの場合、trueを返す", () => {
        useAppStore.getState().setLoading("test1", false);
        useAppStore.getState().setLoading("test2", true);

        expect(useAppStore.getState().isAnyLoading()).toBe(true);
      });
    });
  });

  describe("Notification Helpers", () => {
    it("createSuccessNotification", () => {
      const notification = createSuccessNotification(
        "成功",
        "操作が完了しました",
      );
      expect(notification.type).toBe("success");
      expect(notification.title).toBe("成功");
      expect(notification.message).toBe("操作が完了しました");
      expect(notification.duration).toBe(3000);
    });

    it("createErrorNotification", () => {
      const notification = createErrorNotification(
        "エラー",
        "操作に失敗しました",
      );
      expect(notification.type).toBe("error");
      expect(notification.title).toBe("エラー");
      expect(notification.message).toBe("操作に失敗しました");
      expect(notification.duration).toBe(8000);
    });
  });
}
