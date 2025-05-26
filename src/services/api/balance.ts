/**
 * 残高関連API関数
 *
 * ResultAsync<T, ApiError>を使用した型安全な残高API
 */

import { ResultAsync } from "neverthrow";
import { ApiError } from "@/shared/types/errors";
import { Transaction } from "@/shared/types/transaction";
import { apiGet, apiPost, apiPut } from "./base";

/**
 * 残高データ型
 */
export interface BalanceData {
  userId: string;
  currentBalance: number;
  availableBalance: number;
  pendingAmount: number;
  ecoContributionTotal: number;
  lastUpdated: string;
}

/**
 * チャージリクエスト型
 */
export interface ChargeRequest {
  amount: number;
  paymentMethod: "bank_transfer" | "credit_card" | "convenience_store" | "atm";
  paymentDetails?: Record<string, unknown>;
}

/**
 * チャージレスポンス型
 */
export interface ChargeResponse {
  transactionId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  estimatedCompletionTime?: string;
  paymentInstructions?: string;
}

/**
 * 決済リクエスト型
 */
export interface PaymentRequest {
  amount: number;
  merchantId: string;
  description: string;
  ecoContribution?: {
    enabled: boolean;
    percentage?: number;
    fixedAmount?: number;
    projectId?: string;
  };
}

/**
 * 決済レスポンス型
 */
export interface PaymentResponse {
  transactionId: string;
  amount: number;
  ecoContributionAmount: number;
  status: "success" | "failed" | "pending";
  newBalance: number;
}

/**
 * 送金リクエスト型
 */
export interface TransferRequest {
  recipientId: string;
  amount: number;
  message?: string;
  splitInfo?: {
    totalParticipants: number;
    description: string;
  };
}

/**
 * 送金レスポンス型
 */
export interface TransferResponse {
  transactionId: string;
  amount: number;
  recipientId: string;
  status: "success" | "failed" | "pending";
  newBalance: number;
}

/**
 * 残高制限情報型
 */
export interface BalanceLimits {
  dailyChargeLimit: number;
  monthlyChargeLimit: number;
  maxBalance: number;
  minTransactionAmount: number;
  maxTransactionAmount: number;
  dailyUsedCharge: number;
  monthlyUsedCharge: number;
}

/**
 * エコ貢献統計型
 */
export interface EcoContributionStats {
  totalContribution: number;
  monthlyContribution: number;
  contributionByProject: Record<string, number>;
  carbonOffsetKg: number;
  treesPlanted: number;
  rank: string;
  nextRankThreshold: number;
}

/**
 * 残高履歴取得オプション型
 */
export interface BalanceHistoryOptions {
  startDate?: string;
  endDate?: string;
  transactionType?: Transaction["type"];
  limit?: number;
  offset?: number;
}

/**
 * 残高履歴レスポンス型
 */
export interface BalanceHistoryResponse {
  transactions: Transaction[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * 現在の残高を取得
 */
export function fetchBalance(
  userId?: string,
): ResultAsync<BalanceData, ApiError> {
  const endpoint = userId ? `/balance/${userId}` : "/balance/me";
  return apiGet<BalanceData>(endpoint);
}

/**
 * 残高制限情報を取得
 */
export function fetchBalanceLimits(): ResultAsync<BalanceLimits, ApiError> {
  return apiGet<BalanceLimits>("/balance/limits");
}

/**
 * 残高履歴を取得
 */
export function fetchBalanceHistory(
  options: BalanceHistoryOptions = {},
): ResultAsync<BalanceHistoryResponse, ApiError> {
  const queryParams = new URLSearchParams();

  if (options.startDate) queryParams.append("startDate", options.startDate);
  if (options.endDate) queryParams.append("endDate", options.endDate);
  if (options.transactionType)
    queryParams.append("type", options.transactionType);
  if (options.limit) queryParams.append("limit", options.limit.toString());
  if (options.offset) queryParams.append("offset", options.offset.toString());

  const endpoint = `/balance/history${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return apiGet<BalanceHistoryResponse>(endpoint);
}

/**
 * チャージを実行
 */
export function chargeBalance(
  request: ChargeRequest,
): ResultAsync<ChargeResponse, ApiError> {
  return apiPost<ChargeResponse>("/balance/charge", request);
}

/**
 * 決済を実行
 */
export function processPayment(
  request: PaymentRequest,
): ResultAsync<PaymentResponse, ApiError> {
  return apiPost<PaymentResponse>("/balance/payment", request);
}

/**
 * 送金を実行
 */
export function transferMoney(
  request: TransferRequest,
): ResultAsync<TransferResponse, ApiError> {
  return apiPost<TransferResponse>("/balance/transfer", request);
}

/**
 * エコ貢献統計を取得
 */
export function fetchEcoContributionStats(): ResultAsync<
  EcoContributionStats,
  ApiError
> {
  return apiGet<EcoContributionStats>("/balance/eco-stats");
}

/**
 * 残高を強制更新（管理者向け）
 */
export function forceUpdateBalance(
  userId: string,
  newBalance: number,
  reason: string,
): ResultAsync<BalanceData, ApiError> {
  return apiPut<BalanceData>(`/balance/${userId}/force-update`, {
    newBalance,
    reason,
  });
}

/**
 * チャージ取引のステータスを確認
 */
export function checkChargeStatus(
  transactionId: string,
): ResultAsync<ChargeResponse, ApiError> {
  return apiGet<ChargeResponse>(`/balance/charge/${transactionId}/status`);
}

/**
 * 決済取引のステータスを確認
 */
export function checkPaymentStatus(
  transactionId: string,
): ResultAsync<PaymentResponse, ApiError> {
  return apiGet<PaymentResponse>(`/balance/payment/${transactionId}/status`);
}

/**
 * 送金取引のステータスを確認
 */
export function checkTransferStatus(
  transactionId: string,
): ResultAsync<TransferResponse, ApiError> {
  return apiGet<TransferResponse>(`/balance/transfer/${transactionId}/status`);
}

/**
 * 残高不足チェック
 */
export function checkSufficientBalance(
  amount: number,
): ResultAsync<boolean, ApiError> {
  return apiPost<boolean>("/balance/check-sufficient", { amount });
}

// In Source Testing
if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  // API基盤関数のモック
  vi.mock("./base", () => ({
    apiGet: vi.fn(),
    apiPost: vi.fn(),
    apiPut: vi.fn(),
  }));

  describe("Balance API Functions", () => {
    const mockBalanceData: BalanceData = {
      userId: "usr_12345",
      currentBalance: 8500,
      availableBalance: 8500,
      pendingAmount: 0,
      ecoContributionTotal: 1250,
      lastUpdated: "2025-01-25T12:00:00Z",
    };

    const mockChargeResponse: ChargeResponse = {
      transactionId: "txn_charge_001",
      amount: 20000,
      status: "pending",
      estimatedCompletionTime: "2025-01-25T15:00:00Z",
      paymentInstructions: "ATMで入金してください",
    };

    const mockPaymentResponse: PaymentResponse = {
      transactionId: "txn_payment_001",
      amount: 580,
      ecoContributionAmount: 30,
      status: "success",
      newBalance: 7920,
    };

    const mockTransferResponse: TransferResponse = {
      transactionId: "txn_transfer_001",
      amount: 3000,
      recipientId: "usr_67890",
      status: "success",
      newBalance: 5500,
    };

    const mockBalanceLimits: BalanceLimits = {
      dailyChargeLimit: 50000,
      monthlyChargeLimit: 1000000,
      maxBalance: 500000,
      minTransactionAmount: 1,
      maxTransactionAmount: 50000,
      dailyUsedCharge: 10000,
      monthlyUsedCharge: 50000,
    };

    const mockEcoStats: EcoContributionStats = {
      totalContribution: 1250,
      monthlyContribution: 350,
      contributionByProject: {
        森林保全: 800,
        海洋プラスチック削減: 450,
      },
      carbonOffsetKg: 25.5,
      treesPlanted: 12,
      rank: "エコマイスター",
      nextRankThreshold: 2000,
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe("fetchBalance", () => {
      it("ユーザーIDなしで自分の残高を取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockBalanceData),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchBalance();

        expect(mockApiGet).toHaveBeenCalledWith("/balance/me");
      });

      it("ユーザーIDありで他のユーザーの残高を取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockBalanceData),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchBalance("usr_12345");

        expect(mockApiGet).toHaveBeenCalledWith("/balance/usr_12345");
      });
    });

    describe("fetchBalanceLimits", () => {
      it("残高制限情報を取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockBalanceLimits),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchBalanceLimits();

        expect(mockApiGet).toHaveBeenCalledWith("/balance/limits");
      });
    });

    describe("fetchBalanceHistory", () => {
      it("オプションなしで残高履歴を取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        const mockResponse = {
          transactions: [],
          totalCount: 0,
          hasMore: false,
        };

        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchBalanceHistory();

        expect(mockApiGet).toHaveBeenCalledWith("/balance/history");
      });

      it("オプション付きで残高履歴を取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;
        const mockResponse = {
          transactions: [],
          totalCount: 0,
          hasMore: false,
        };

        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        const options = {
          startDate: "2025-01-01",
          endDate: "2025-01-31",
          transactionType: "payment" as const,
          limit: 20,
          offset: 0,
        };

        fetchBalanceHistory(options);

        expect(mockApiGet).toHaveBeenCalledWith(
          "/balance/history?startDate=2025-01-01&endDate=2025-01-31&type=payment&limit=20",
        );
      });
    });

    describe("chargeBalance", () => {
      it("チャージを実行", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const chargeRequest: ChargeRequest = {
          amount: 20000,
          paymentMethod: "bank_transfer",
        };

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockChargeResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        chargeBalance(chargeRequest);

        expect(mockApiPost).toHaveBeenCalledWith(
          "/balance/charge",
          chargeRequest,
        );
      });
    });

    describe("processPayment", () => {
      it("決済を実行", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const paymentRequest: PaymentRequest = {
          amount: 580,
          merchantId: "merchant_eco_cafe",
          description: "エコカフェ 渋谷店",
          ecoContribution: {
            enabled: true,
            percentage: 5,
            projectId: "forest_conservation",
          },
        };

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockPaymentResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        processPayment(paymentRequest);

        expect(mockApiPost).toHaveBeenCalledWith(
          "/balance/payment",
          paymentRequest,
        );
      });
    });

    describe("transferMoney", () => {
      it("送金を実行", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;
        const transferRequest: TransferRequest = {
          recipientId: "usr_67890",
          amount: 3000,
          message: "ランチ代",
        };

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransferResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        transferMoney(transferRequest);

        expect(mockApiPost).toHaveBeenCalledWith(
          "/balance/transfer",
          transferRequest,
        );
      });
    });

    describe("fetchEcoContributionStats", () => {
      it("エコ貢献統計を取得", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;

        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockEcoStats),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        fetchEcoContributionStats();

        expect(mockApiGet).toHaveBeenCalledWith("/balance/eco-stats");
      });
    });

    describe("checkSufficientBalance", () => {
      it("残高不足チェック", async () => {
        const mockApiPost = vi.mocked(await import("./base")).apiPost;

        mockApiPost.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(true),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        checkSufficientBalance(5000);

        expect(mockApiPost).toHaveBeenCalledWith("/balance/check-sufficient", {
          amount: 5000,
        });
      });
    });

    describe("Status Check Functions", () => {
      it("チャージステータスを確認", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;

        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockChargeResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        checkChargeStatus("txn_charge_001");

        expect(mockApiGet).toHaveBeenCalledWith(
          "/balance/charge/txn_charge_001/status",
        );
      });

      it("決済ステータスを確認", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;

        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockPaymentResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        checkPaymentStatus("txn_payment_001");

        expect(mockApiGet).toHaveBeenCalledWith(
          "/balance/payment/txn_payment_001/status",
        );
      });

      it("送金ステータスを確認", async () => {
        const mockApiGet = vi.mocked(await import("./base")).apiGet;

        mockApiGet.mockReturnValue(
          ResultAsync.fromPromise(
            Promise.resolve(mockTransferResponse),
            () =>
              ({ type: "NETWORK_ERROR", message: "Network error" }) as ApiError,
          ),
        );

        checkTransferStatus("txn_transfer_001");

        expect(mockApiGet).toHaveBeenCalledWith(
          "/balance/transfer/txn_transfer_001/status",
        );
      });
    });
  });
}
