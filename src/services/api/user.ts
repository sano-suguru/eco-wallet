/**
 * ユーザー関連API関数
 *
 * ResultAsync<T, ApiError>を使用した型安全なユーザーAPI
 */

import { ResultAsync } from "neverthrow";
import { ApiError } from "@/shared/types/errors";
import { apiGet, apiPost, apiPut, apiPatch } from "./base";

/**
 * ユーザープロフィール型（再エクスポート）
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarInitials: string;
  ecoRank: string;
  balance: number;
  joinDate: string;
}

/**
 * ユーザープロフィール更新データ型
 */
export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

/**
 * パスワード変更データ型
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * ユーザー認証データ型
 */
export interface AuthUserData {
  email: string;
  password: string;
}

/**
 * ユーザー登録データ型
 */
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 認証レスポンス型
 */
export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
}

/**
 * ユーザープロフィールを取得
 */
export function fetchUserProfile(
  userId?: string,
): ResultAsync<UserProfile, ApiError> {
  const endpoint = userId ? `/users/${userId}` : "/users/me";
  return apiGet<UserProfile>(endpoint);
}

/**
 * ユーザープロフィールを更新
 */
export function updateUserProfile(
  userId: string,
  data: UpdateUserProfileData,
): ResultAsync<UserProfile, ApiError> {
  return apiPut<UserProfile>(`/users/${userId}`, data);
}

/**
 * 現在のユーザーのプロフィールを更新
 */
export function updateMyProfile(
  data: UpdateUserProfileData,
): ResultAsync<UserProfile, ApiError> {
  return apiPut<UserProfile>("/users/me", data);
}

/**
 * パスワードを変更
 */
export function changePassword(
  data: ChangePasswordData,
): ResultAsync<void, ApiError> {
  return apiPatch<void>("/users/me/password", data);
}

/**
 * ユーザーログイン
 */
export function loginUser(
  data: AuthUserData,
): ResultAsync<AuthResponse, ApiError> {
  return apiPost<AuthResponse>("/auth/login", data);
}

/**
 * ユーザー登録
 */
export function registerUser(
  data: RegisterUserData,
): ResultAsync<AuthResponse, ApiError> {
  return apiPost<AuthResponse>("/auth/register", data);
}

/**
 * ユーザーログアウト
 */
export function logoutUser(): ResultAsync<void, ApiError> {
  return apiPost<void>("/auth/logout");
}

/**
 * トークンリフレッシュ
 */
export function refreshToken(
  refreshToken: string,
): ResultAsync<AuthResponse, ApiError> {
  return apiPost<AuthResponse>("/auth/refresh", { refreshToken });
}

/**
 * パスワードリセット要求
 */
export function requestPasswordReset(
  email: string,
): ResultAsync<void, ApiError> {
  return apiPost<void>("/auth/forgot-password", { email });
}

/**
 * パスワードリセット実行
 */
export function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
): ResultAsync<void, ApiError> {
  return apiPost<void>("/auth/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });
}

/**
 * メールアドレス確認
 */
export function verifyEmail(token: string): ResultAsync<void, ApiError> {
  return apiPost<void>("/auth/verify-email", { token });
}

/**
 * メールアドレス確認再送
 */
export function resendEmailVerification(): ResultAsync<void, ApiError> {
  return apiPost<void>("/auth/resend-verification");
}

/**
 * ユーザーアカウント削除
 */
export function deleteUserAccount(
  password: string,
): ResultAsync<void, ApiError> {
  return apiPost<void>("/users/me/delete", { password });
}

// In Source Testing
if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  // API基盤関数のモック
  vi.mock("./base", () => ({
    apiGet: vi.fn(),
    apiPost: vi.fn(),
    apiPut: vi.fn(),
    apiPatch: vi.fn(),
  }));

  describe("User API Functions", () => {
    const mockUserProfile: UserProfile = {
      id: "usr_12345",
      name: "山田 太郎",
      email: "test@example.com",
      avatarUrl: "/api/placeholder/100/100",
      avatarInitials: "山田",
      ecoRank: "エコマイスター",
      balance: 8500,
      joinDate: "2024-12-01",
    };

    const mockAuthResponse: AuthResponse = {
      user: mockUserProfile,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe("fetchUserProfile", () => {
      it("ユーザーIDなしで自分のプロフィールを取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockUserProfile),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchUserProfile();

        expect(mockApiGet).toHaveBeenCalledWith("/users/me");
      });

      it("ユーザーIDありで他のユーザーのプロフィールを取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockUserProfile),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchUserProfile("usr_12345");

        expect(mockApiGet).toHaveBeenCalledWith("/users/usr_12345");
      });
    });

    describe("updateUserProfile", () => {
      it("他のユーザーのプロフィールを更新", async () => {
        const mockApiPut = vi.mocked(await import("./base")).apiPut;
        const updateData = { name: "佐藤 花子" };

        mockApiPut.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve({ ...mockUserProfile, ...updateData }),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        updateUserProfile("usr_12345", updateData);

        expect(mockApiPut).toHaveBeenCalledWith("/users/usr_12345", updateData);
      });
    });

    describe("updateMyProfile", () => {
      it("自分のプロフィールを更新", async () => {
        const mockApiPut = vi.mocked(await import("./base")).apiPut;
        const updateData = { name: "佐藤 花子" };

        mockApiPut.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve({ ...mockUserProfile, ...updateData }),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        updateMyProfile(updateData);

        expect(mockApiPut).toHaveBeenCalledWith("/users/me", updateData);
      });
    });

    describe("changePassword", () => {
      it("パスワードを変更", async () => {
        const mockApiPatch = vi.mocked(await import("./base")).apiPatch;
        const passwordData = {
          currentPassword: "oldpass123",
          newPassword: "newpass456",
          confirmPassword: "newpass456",
        };

        mockApiPatch.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        changePassword(passwordData);

        expect(mockApiPatch).toHaveBeenCalledWith(
          "/users/me/password",
          passwordData,
        );
      });
    });

    describe("loginUser", () => {
      it("ユーザーログイン", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const loginData = {
          email: "test@example.com",
          password: "password123",
        };

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockAuthResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        loginUser(loginData);

        expect(mockApiPost).toHaveBeenCalledWith("/auth/login", loginData);
      });
    });

    describe("registerUser", () => {
      it("ユーザー登録", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const registerData = {
          name: "山田 太郎",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
        };

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockAuthResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        registerUser(registerData);

        expect(mockApiPost).toHaveBeenCalledWith(
          "/auth/register",
          registerData,
        );
      });
    });

    describe("logoutUser", () => {
      it("ユーザーログアウト", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        logoutUser();

        expect(mockApiPost).toHaveBeenCalledWith("/auth/logout");
      });
    });

    describe("refreshToken", () => {
      it("トークンリフレッシュ", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const refreshTokenValue = "mock-refresh-token";

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockAuthResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        refreshToken(refreshTokenValue);

        expect(mockApiPost).toHaveBeenCalledWith("/auth/refresh", {
          refreshToken: refreshTokenValue,
        });
      });
    });

    describe("requestPasswordReset", () => {
      it("パスワードリセット要求", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const email = "test@example.com";

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        requestPasswordReset(email);

        expect(mockApiPost).toHaveBeenCalledWith("/auth/forgot-password", {
          email,
        });
      });
    });

    describe("resetPassword", () => {
      it("パスワードリセット実行", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const token = "reset-token";
        const newPassword = "newpass123";
        const confirmPassword = "newpass123";

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        resetPassword(token, newPassword, confirmPassword);

        expect(mockApiPost).toHaveBeenCalledWith("/auth/reset-password", {
          token,
          newPassword,
          confirmPassword,
        });
      });
    });

    describe("verifyEmail", () => {
      it("メールアドレス確認", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const token = "verify-token";

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        verifyEmail(token);

        expect(mockApiPost).toHaveBeenCalledWith("/auth/verify-email", {
          token,
        });
      });
    });

    describe("deleteUserAccount", () => {
      it("ユーザーアカウント削除", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const password = "password123";

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        deleteUserAccount(password);

        expect(mockApiPost).toHaveBeenCalledWith("/users/me/delete", {
          password,
        });
      });
    });
  });
}
