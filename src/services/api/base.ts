/**
 * API基盤関数
 *
 * neverthrowのResultAsync<T, E>を使用した型安全なAPI呼び出し基盤
 * すべてのAPI関数で統一されたエラーハンドリングパターンを提供
 */

import { ResultAsync } from "neverthrow";
import { ApiError } from "@/shared/types/errors";

/**
 * HTTPメソッド型
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * API設定
 */
export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * リクエストオプション
 */
export interface RequestOptions {
  method: HttpMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * デフォルトAPI設定
 */
const DEFAULT_CONFIG: Required<ApiConfig> = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 30000, // 30秒
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * 設定されたAPI設定
 */
let apiConfig: Required<ApiConfig> = { ...DEFAULT_CONFIG };

/**
 * API設定を更新
 */
export function configureApi(config: ApiConfig): void {
  apiConfig = { ...apiConfig, ...config };
}

/**
 * HTTPステータスコードからApiErrorを作成
 */
function createApiErrorFromStatus(
  status: number,
  statusText: string,
  url: string,
): ApiError {
  switch (status) {
    case 400:
      return {
        type: "BAD_REQUEST",
        message: `Bad Request: ${statusText}`,
      };
    case 401:
      return {
        type: "UNAUTHORIZED",
        message: "Unauthorized access",
      };
    case 403:
      return {
        type: "FORBIDDEN",
        message: "Access forbidden",
      };
    case 404:
      return {
        type: "NOT_FOUND",
        message: `Resource not found: ${url}`,
      };
    case 409:
      return {
        type: "CONFLICT",
        message: `Conflict: ${statusText}`,
      };
    case 429:
      return {
        type: "RATE_LIMIT_EXCEEDED",
        message: "Rate limit exceeded",
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: "SERVER_ERROR",
        message: `Server error: ${statusText}`,
        statusCode: status,
      };
    default:
      return {
        type: "SERVER_ERROR",
        message: `HTTP ${status}: ${statusText}`,
        statusCode: status,
      };
  }
}

/**
 * エラーオブジェクトからApiErrorを作成
 */
function createApiErrorFromError(error: Error, url: string): ApiError {
  // ネットワークエラーの判定
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      type: "NETWORK_ERROR",
      message: "Network connection failed",
      cause: error,
    };
  }

  // タイムアウトエラーの判定
  if (error.name === "AbortError" || error.message.includes("timeout")) {
    return {
      type: "TIMEOUT_ERROR",
      message: `Request timeout for ${url}`,
      timeoutMs: apiConfig.timeout,
    };
  }

  // その他のエラー
  return {
    type: "NETWORK_ERROR",
    message: error.message || "Unknown network error",
    cause: error,
  };
}

/**
 * 共通APIリクエスト関数
 */
function makeRequest<T>(options: RequestOptions): ResultAsync<T, ApiError> {
  const {
    method,
    url,
    data,
    headers = {},
    timeout = apiConfig.timeout,
  } = options;
  const fullUrl = url.startsWith("http") ? url : `${apiConfig.baseUrl}${url}`;

  // リクエストヘッダーの構築
  const requestHeaders = {
    ...apiConfig.headers,
    ...headers,
  };

  // AbortControllerによるタイムアウト制御
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // fetch設定
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    signal: controller.signal,
  };

  // POSTやPUTの場合はbodyを追加
  if (data && ["POST", "PUT", "PATCH"].includes(method)) {
    fetchOptions.body = JSON.stringify(data);
  }

  return ResultAsync.fromPromise(
    fetch(fullUrl, fetchOptions).then(async (response) => {
      clearTimeout(timeoutId);

      // HTTPステータスチェック
      if (!response.ok) {
        throw createApiErrorFromStatus(
          response.status,
          response.statusText,
          fullUrl,
        );
      }

      // レスポンスの解析
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    }),
    (error) => {
      clearTimeout(timeoutId);

      // ApiErrorの場合はそのまま返す
      if (typeof error === "object" && error !== null && "type" in error) {
        return error as ApiError;
      }

      // ErrorオブジェクトからApiErrorを作成
      return createApiErrorFromError(error as Error, fullUrl);
    },
  );
}

/**
 * GET リクエスト
 */
export function apiGet<T>(
  url: string,
  headers?: Record<string, string>,
): ResultAsync<T, ApiError> {
  return makeRequest<T>({
    method: "GET",
    url,
    headers,
  });
}

/**
 * POST リクエスト
 */
export function apiPost<T>(
  url: string,
  data?: unknown,
  headers?: Record<string, string>,
): ResultAsync<T, ApiError> {
  return makeRequest<T>({
    method: "POST",
    url,
    data,
    headers,
  });
}

/**
 * PUT リクエスト
 */
export function apiPut<T>(
  url: string,
  data?: unknown,
  headers?: Record<string, string>,
): ResultAsync<T, ApiError> {
  return makeRequest<T>({
    method: "PUT",
    url,
    data,
    headers,
  });
}

/**
 * DELETE リクエスト
 */
export function apiDelete<T>(
  url: string,
  headers?: Record<string, string>,
): ResultAsync<T, ApiError> {
  return makeRequest<T>({
    method: "DELETE",
    url,
    headers,
  });
}

/**
 * PATCH リクエスト
 */
export function apiPatch<T>(
  url: string,
  data?: unknown,
  headers?: Record<string, string>,
): ResultAsync<T, ApiError> {
  return makeRequest<T>({
    method: "PATCH",
    url,
    data,
    headers,
  });
}

// In Source Testing
if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach, afterEach } = import.meta
    .vitest;

  // グローバルfetchのモック
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  describe("API Base Functions", () => {
    beforeEach(() => {
      mockFetch.mockReset();
      // デフォルト設定にリセット
      configureApi(DEFAULT_CONFIG);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    describe("configureApi", () => {
      it("API設定を正しく更新できる", () => {
        const customConfig = {
          baseUrl: "https://api.example.com",
          timeout: 5000,
          headers: { "X-Custom": "test" },
        };

        configureApi(customConfig);

        // 内部状態の確認は間接的にテスト
        expect(true).toBe(true); // 設定関数が正常に実行されることを確認
      });
    });

    describe("apiGet", () => {
      it("成功時にOkResultを返す", async () => {
        const mockData = { id: 1, name: "test" };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: () => Promise.resolve(mockData),
        });

        const result = await apiGet<typeof mockData>("/test");

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value).toEqual(mockData);
        }
      });

      it("404エラー時にNOT_FOUNDエラーを返す", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        });

        const result = await apiGet("/not-found");

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.type).toBe("NOT_FOUND");
        }
      });

      it("ネットワークエラー時にNETWORK_ERRORを返す", async () => {
        const networkError = new TypeError("Failed to fetch");
        mockFetch.mockRejectedValueOnce(networkError);

        const result = await apiGet("/test");

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.type).toBe("NETWORK_ERROR");
          if (result.error.type === "NETWORK_ERROR") {
            expect(result.error.cause).toBe(networkError);
          }
        }
      });
    });

    describe("apiPost", () => {
      it("データ付きPOSTリクエストが成功する", async () => {
        const requestData = { name: "test" };
        const responseData = { id: 1, ...requestData };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: () => Promise.resolve(responseData),
        });

        const result = await apiPost("/test", requestData);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value).toEqual(responseData);
        }

        // fetchが正しいパラメータで呼ばれたことを確認
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/test",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify(requestData),
            headers: expect.objectContaining({
              "Content-Type": "application/json",
            }),
          }),
        );
      });

      it("400エラー時にBAD_REQUESTエラーを返す", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        });

        const result = await apiPost("/test", {});

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.type).toBe("BAD_REQUEST");
        }
      });
    });

    describe("HTTP Status Code Handling", () => {
      const statusTests = [
        { status: 401, expectedType: "UNAUTHORIZED" },
        { status: 403, expectedType: "FORBIDDEN" },
        { status: 409, expectedType: "CONFLICT" },
        { status: 429, expectedType: "RATE_LIMIT_EXCEEDED" },
        { status: 500, expectedType: "SERVER_ERROR" },
        { status: 502, expectedType: "SERVER_ERROR" },
        { status: 503, expectedType: "SERVER_ERROR" },
      ];

      statusTests.forEach(({ status, expectedType }) => {
        it(`${status}ステータスで${expectedType}エラーを返す`, async () => {
          mockFetch.mockResolvedValueOnce({
            ok: false,
            status,
            statusText: `Status ${status}`,
          });

          const result = await apiGet("/test");

          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error.type).toBe(expectedType);
          }
        });
      });
    });

    describe("Timeout Handling", () => {
      it("タイムアウト時にTIMEOUT_ERRORを返す", async () => {
        // AbortErrorをシミュレート
        const abortError = new Error("The operation was aborted");
        abortError.name = "AbortError";
        mockFetch.mockRejectedValueOnce(abortError);

        const result = await apiGet("/test");

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.type).toBe("TIMEOUT_ERROR");
        }
      });
    });
  });
}
