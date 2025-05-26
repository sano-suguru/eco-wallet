/**
 * 認証状態管理ストア（Result型対応）
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Result, ResultAsync, ok, err } from "neverthrow";
import { BusinessError, AppError } from "../../../shared/types/errors";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchUserProfile,
  updateUserProfile,
  type AuthUserData,
  type RegisterUserData,
  type UserProfile,
} from "../../../services/api/user";

/**
 * 認証状態の型定義
 */
export interface AuthState {
  // ユーザー情報
  user: UserProfile | null;
  isAuthenticated: boolean;

  // 状態管理
  isLoading: boolean;
  error: AppError | null;

  // 認証アクション（Result型対応）
  loginAsync: (credentials: AuthUserData) => ResultAsync<void, AppError>;
  registerAsync: (userData: RegisterUserData) => ResultAsync<void, AppError>;
  logoutAsync: () => ResultAsync<void, AppError>;

  // プロフィール管理（Result型対応）
  fetchUserProfileAsync: (userId?: string) => ResultAsync<void, AppError>;
  updateUserProfileAsync: (
    updates: Partial<UserProfile>,
  ) => ResultAsync<void, AppError>;

  // 認証状態チェック（Result型対応）
  checkAuthStatus: () => Result<boolean, BusinessError>;
  validateSession: () => Result<boolean, BusinessError>;

  // ユーティリティ
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

/**
 * 認証状態管理ストア（Result型対応）
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初期状態
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ログイン処理（API統合）
      loginAsync: (credentials: AuthUserData) => {
        return ResultAsync.fromSafePromise(
          (async () => {
            set({ isLoading: true, error: null });

            const loginResult = await loginUser(credentials);

            if (loginResult.isErr()) {
              const error: AppError = loginResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            // ユーザープロフィールを取得
            const profileResult = await fetchUserProfile();

            if (profileResult.isErr()) {
              const error: AppError = profileResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            const userProfile = profileResult.value;

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          })(),
        ).mapErr((error: unknown): AppError => {
          const appError: AppError =
            error && typeof error === "object" && "type" in error
              ? (error as AppError)
              : { type: "NETWORK_ERROR", message: String(error) };

          set({ isLoading: false, error: appError });
          return appError;
        });
      },

      // ユーザー登録処理（API統合）
      registerAsync: (userData: RegisterUserData) => {
        return ResultAsync.fromSafePromise(
          (async () => {
            set({ isLoading: true, error: null });

            const registerResult = await registerUser(userData);

            if (registerResult.isErr()) {
              const error: AppError = registerResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            // 登録後、プロフィール情報を取得
            const profileResult = await fetchUserProfile();

            if (profileResult.isErr()) {
              const error: AppError = profileResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            const userProfile = profileResult.value;

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          })(),
        ).mapErr((error: unknown): AppError => {
          const appError: AppError =
            error && typeof error === "object" && "type" in error
              ? (error as AppError)
              : { type: "NETWORK_ERROR", message: String(error) };

          set({ isLoading: false, error: appError });
          return appError;
        });
      },

      // ログアウト処理（API統合）
      logoutAsync: () => {
        return ResultAsync.fromSafePromise(
          (async () => {
            set({ isLoading: true, error: null });

            const logoutResult = await logoutUser();

            if (logoutResult.isErr()) {
              const error: AppError = logoutResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          })(),
        ).mapErr((error: unknown): AppError => {
          const appError: AppError =
            error && typeof error === "object" && "type" in error
              ? (error as AppError)
              : { type: "NETWORK_ERROR", message: String(error) };

          set({ isLoading: false, error: appError });
          return appError;
        });
      },

      // ユーザープロフィール取得（API統合）
      fetchUserProfileAsync: (userId?: string) => {
        return ResultAsync.fromSafePromise(
          (async () => {
            set({ isLoading: true, error: null });

            const profileResult = await fetchUserProfile(userId);

            if (profileResult.isErr()) {
              const error: AppError = profileResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            const userProfile = profileResult.value;

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          })(),
        ).mapErr((error: unknown): AppError => {
          const appError: AppError =
            error && typeof error === "object" && "type" in error
              ? (error as AppError)
              : { type: "NETWORK_ERROR", message: String(error) };

          set({ isLoading: false, error: appError });
          return appError;
        });
      },

      // ユーザープロフィール更新（API統合）
      updateUserProfileAsync: (updates: Partial<UserProfile>) => {
        return ResultAsync.fromSafePromise(
          (async () => {
            set({ isLoading: true, error: null });

            const { user } = get();
            if (!user) {
              throw {
                type: "UNAUTHORIZED",
                message: "ユーザーがログインしていません",
              } as AppError;
            }

            const updateResult = await updateUserProfile(user.id, updates);

            if (updateResult.isErr()) {
              const error: AppError = updateResult.error;
              set({ isLoading: false, error });
              throw error;
            }

            const updatedProfile = updateResult.value;

            set({
              user: updatedProfile,
              isLoading: false,
              error: null,
            });
          })(),
        ).mapErr((error: unknown): AppError => {
          const appError: AppError =
            error && typeof error === "object" && "type" in error
              ? (error as AppError)
              : { type: "NETWORK_ERROR", message: String(error) };

          set({ isLoading: false, error: appError });
          return appError;
        });
      },

      // 認証状態チェック（Result型対応）
      checkAuthStatus: () => {
        try {
          const { user, isAuthenticated } = get();

          if (!isAuthenticated || !user) {
            return ok(false);
          }

          // セッションの有効性をチェック
          const sessionValidation = get().validateSession();
          if (sessionValidation.isErr()) {
            return err(sessionValidation.error);
          }

          return ok(sessionValidation.value);
        } catch (error) {
          return err({
            type: "ACCOUNT_SUSPENDED",
            message: "認証状態の確認に失敗しました",
            reason: String(error),
          });
        }
      },

      // セッション検証（Result型対応）
      validateSession: () => {
        try {
          const { user } = get();

          if (!user) {
            return err({
              type: "ACCOUNT_SUSPENDED",
              message: "ユーザー情報が存在しません",
              reason: "user is null",
            });
          }

          // 基本的なセッション検証
          if (!user.id || !user.email) {
            return err({
              type: "ACCOUNT_SUSPENDED",
              message: "ユーザー情報が不完全です",
              reason: `userId: ${user.id}, email: ${user.email}`,
            });
          }

          return ok(true);
        } catch (error) {
          return err({
            type: "ACCOUNT_SUSPENDED",
            message: "セッション検証中にエラーが発生しました",
            reason: String(error),
          });
        }
      },

      // ローカルログアウト（同期処理）
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // エラーをクリア
      clearError: () => {
        set({ error: null });
      },

      // ローディング状態を設定
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// In Source Testing
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest;

  describe("AuthStore", () => {
    beforeEach(() => {
      // ストアをリセット
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    });

    describe("checkAuthStatus", () => {
      it("未認証の場合、falseを返す", () => {
        const result = useAuthStore.getState().checkAuthStatus();
        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap()).toBe(false);
      });

      it("認証済みの場合、trueを返す", () => {
        // 認証状態をセット
        useAuthStore.setState({
          user: {
            id: "user_123",
            email: "test@example.com",
            name: "Test User",
            avatarUrl: "/avatar.jpg",
            avatarInitials: "TU",
            ecoRank: "エコマイスター",
            balance: 5000,
            joinDate: "2023-01-01",
          },
          isAuthenticated: true,
        });

        const result = useAuthStore.getState().checkAuthStatus();
        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap()).toBe(true);
      });
    });

    describe("validateSession", () => {
      it("ユーザー情報がない場合、エラーを返す", () => {
        const result = useAuthStore.getState().validateSession();
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().type).toBe("ACCOUNT_SUSPENDED");
      });

      it("有効なユーザー情報がある場合、成功を返す", () => {
        useAuthStore.setState({
          user: {
            id: "user_123",
            email: "test@example.com",
            name: "Test User",
            avatarUrl: "/avatar.jpg",
            avatarInitials: "TU",
            ecoRank: "エコマイスター",
            balance: 5000,
            joinDate: "2023-01-01",
          },
        });

        const result = useAuthStore.getState().validateSession();
        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap()).toBe(true);
      });

      it("不完全なユーザー情報の場合、エラーを返す", () => {
        useAuthStore.setState({
          user: {
            id: "",
            email: "test@example.com",
            name: "Test User",
            avatarUrl: "/avatar.jpg",
            avatarInitials: "TU",
            ecoRank: "エコマイスター",
            balance: 5000,
            joinDate: "2023-01-01",
          },
        });

        const result = useAuthStore.getState().validateSession();
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr().type).toBe("ACCOUNT_SUSPENDED");
      });
    });

    describe("logout", () => {
      it("ログアウト時に状態をクリアする", () => {
        // 認証状態をセット
        useAuthStore.setState({
          user: {
            id: "user_123",
            email: "test@example.com",
            name: "Test User",
            avatarUrl: "/avatar.jpg",
            avatarInitials: "TU",
            ecoRank: "エコマイスター",
            balance: 5000,
            joinDate: "2023-01-01",
          },
          isAuthenticated: true,
        });

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe("clearError", () => {
      it("エラーをクリアする", () => {
        useAuthStore.setState({
          error: {
            type: "NETWORK_ERROR",
            message: "Test error",
          },
        });

        useAuthStore.getState().clearError();

        expect(useAuthStore.getState().error).toBeNull();
      });
    });

    describe("setLoading", () => {
      it("ローディング状態を設定する", () => {
        useAuthStore.getState().setLoading(true);
        expect(useAuthStore.getState().isLoading).toBe(true);

        useAuthStore.getState().setLoading(false);
        expect(useAuthStore.getState().isLoading).toBe(false);
      });
    });
  });
}
