import { ResultAsync } from "neverthrow";
import { ApiError } from "@/shared/types/errors";
import { Transaction } from "@/shared/types/transaction";
import { apiGet, apiPost, apiPut, apiDelete } from "./base";

/**
 * 取引一覧取得のリクエストパラメータ
 */
export interface FetchTransactionsParams {
  userId?: string;
  limit?: number;
  offset?: number;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * 取引一覧取得のレスポンス
 */
export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
}

/**
 * 新規取引作成のリクエストデータ
 */
export interface CreateTransactionRequest {
  type: Transaction["type"];
  description: string;
  amount: number;
  ecoContribution?: Transaction["ecoContribution"];
  campaignInfo?: Transaction["campaignInfo"];
  splitInfo?: Transaction["splitInfo"];
}

/**
 * 取引更新のリクエストデータ
 */
export interface UpdateTransactionRequest {
  description?: string;
  ecoContribution?: Transaction["ecoContribution"];
  campaignInfo?: Transaction["campaignInfo"];
  splitInfo?: Transaction["splitInfo"];
}

/**
 * 取引一覧を取得する
 * @param params 取得パラメータ
 * @returns ResultAsync<TransactionsResponse, ApiError>
 */
export function fetchTransactions(
  params: FetchTransactionsParams = {},
): ResultAsync<TransactionsResponse, ApiError> {
  const queryParams = new URLSearchParams();

  if (params.userId) queryParams.set("userId", params.userId);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());
  if (params.type) queryParams.set("type", params.type);
  if (params.dateFrom) queryParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) queryParams.set("dateTo", params.dateTo);

  const url = `/api/transactions${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

  return apiGet<TransactionsResponse>(url);
}

/**
 * 特定の取引詳細を取得する
 * @param transactionId 取引ID
 * @returns ResultAsync<Transaction, ApiError>
 */
export function fetchTransactionById(
  transactionId: string,
): ResultAsync<Transaction, ApiError> {
  return apiGet<Transaction>(`/api/transactions/${transactionId}`);
}

/**
 * 新規取引を作成する
 * @param request 取引作成データ
 * @returns ResultAsync<Transaction, ApiError>
 */
export function createTransaction(
  request: CreateTransactionRequest,
): ResultAsync<Transaction, ApiError> {
  return apiPost<Transaction>("/api/transactions", request);
}

/**
 * 取引情報を更新する
 * @param transactionId 取引ID
 * @param request 更新データ
 * @returns ResultAsync<Transaction, ApiError>
 */
export function updateTransaction(
  transactionId: string,
  request: UpdateTransactionRequest,
): ResultAsync<Transaction, ApiError> {
  return apiPut<Transaction>(`/api/transactions/${transactionId}`, request);
}

/**
 * 取引を削除する
 * @param transactionId 取引ID
 * @returns ResultAsync<void, ApiError>
 */
export function deleteTransaction(
  transactionId: string,
): ResultAsync<void, ApiError> {
  return apiDelete<void>(`/api/transactions/${transactionId}`);
}

/**
 * ユーザーの取引統計を取得する
 * @param userId ユーザーID（省略時は現在のユーザー）
 * @param period 期間（'month' | 'year'）
 * @returns ResultAsync<TransactionStats, ApiError>
 */
export interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  totalEcoContribution: number;
  typeBreakdown: Record<Transaction["type"], number>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    amount: number;
  }>;
}

export function fetchTransactionStats(
  userId?: string,
  period: "month" | "year" = "month",
): ResultAsync<TransactionStats, ApiError> {
  const queryParams = new URLSearchParams();
  if (userId) queryParams.set("userId", userId);
  queryParams.set("period", period);

  const url = `/api/transactions/stats?${queryParams.toString()}`;
  return apiGet<TransactionStats>(url);
}

// =============================================================================
// In Source Testing
// =============================================================================

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  // API基盤関数のモック
  vi.mock("./base", () => ({
    apiGet: vi.fn(),
    apiPost: vi.fn(),
    apiPut: vi.fn(),
    apiDelete: vi.fn(),
  }));

  describe("Transaction API Functions", () => {
    // テスト用のモックデータ
    const mockTransaction: Transaction = {
      id: "txn_test_01",
      type: "payment",
      description: "テスト取引",
      date: "2025/01/26",
      amount: -1000,
      ecoContribution: {
        enabled: true,
        amount: 50,
        project: "テストプロジェクト",
      },
    };

    const mockTransactionsResponse: TransactionsResponse = {
      transactions: [mockTransaction],
      total: 1,
      hasMore: false,
    };

    const mockTransactionStats: TransactionStats = {
      totalTransactions: 10,
      totalAmount: -50000,
      totalEcoContribution: 2500,
      typeBreakdown: {
        payment: 7,
        charge: 2,
        receive: 1,
        donation: 0,
        expired: 0,
      },
      monthlyTrend: [{ month: "2025-01", count: 10, amount: -50000 }],
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe("fetchTransactions", () => {
      it("取引一覧を正常に取得できる", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransactionsResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchTransactions();

        expect(mockApiGet).toHaveBeenCalledWith("/api/transactions");
      });

      it("クエリパラメータを正しく処理できる", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransactionsResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        const params: FetchTransactionsParams = {
          userId: "user123",
          limit: 10,
          type: "payment",
        };

        fetchTransactions(params);

        expect(mockApiGet).toHaveBeenCalledWith(
          "/api/transactions?userId=user123&limit=10&type=payment",
        );
      });
    });

    describe("fetchTransactionById", () => {
      it("IDで取引を正常に取得できる", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransaction),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchTransactionById("txn_test_01");

        expect(mockApiGet).toHaveBeenCalledWith(
          "/api/transactions/txn_test_01",
        );
      });
    });

    describe("createTransaction", () => {
      it("取引を正常に作成できる", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const request: CreateTransactionRequest = {
          type: "payment",
          description: "テスト取引",
          amount: -1000,
          ecoContribution: {
            enabled: true,
            amount: 50,
            project: "テストプロジェクト",
          },
        };

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransaction),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        createTransaction(request);

        expect(mockApiPost).toHaveBeenCalledWith("/api/transactions", request);
      });
    });

    describe("updateTransaction", () => {
      it("取引を正常に更新できる", async () => {
        const mockApiPut = vi.mocked(await import("./base")).apiPut;
        const request: UpdateTransactionRequest = {
          description: "更新されたテスト取引",
        };

        mockApiPut.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransaction),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        updateTransaction("txn_test_01", request);

        expect(mockApiPut).toHaveBeenCalledWith(
          "/api/transactions/txn_test_01",
          request,
        );
      });
    });

    describe("deleteTransaction", () => {
      it("取引を正常に削除できる", async () => {
        const mockApiDelete = vi.mocked(await import("./base")).apiDelete;

        mockApiDelete.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(undefined),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        deleteTransaction("txn_test_01");

        expect(mockApiDelete).toHaveBeenCalledWith(
          "/api/transactions/txn_test_01",
        );
      });
    });

    describe("fetchTransactionStats", () => {
      it("取引統計を正常に取得できる", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransactionStats),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchTransactionStats("user123", "month");

        expect(mockApiGet).toHaveBeenCalledWith(
          "/api/transactions/stats?userId=user123&period=month",
        );
      });

      it("デフォルトパラメータを正しく使用できる", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransactionStats),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchTransactionStats();

        expect(mockApiGet).toHaveBeenCalledWith(
          "/api/transactions/stats?period=month",
        );
      });
    });
  });
}
