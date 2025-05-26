import { StateCreator } from "zustand";
import { create } from "zustand";
import { Result, ResultAsync, ok, err } from "neverthrow";
import { Transaction, TransactionType } from "@/shared/types/transaction";
import { BusinessError, AppError } from "@/shared/types/errors";
import { transactionsData } from "@/features/transactions/data/transactions-data";
import {
  filterTransactionsByDateRange,
  filterTransactionsByType,
  getRecentTransactions,
  filterTransactionsWithEcoContribution,
  calculateTotalEcoContribution,
} from "@/lib/utils/transactions/filtering";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/api/transactions";
import { validateTransactionAmount } from "@/lib/business/transaction";

/**
 * Transaction スライスの型定義（Result型対応）
 */
export interface TransactionSlice {
  // データ
  transactions: Transaction[];

  // 状態管理
  isLoading: boolean;
  error: AppError | null;

  // アクション（Result型対応）
  addTransaction: (
    transaction: Omit<Transaction, "id">,
  ) => Result<string, BusinessError>;
  addTransactionAsync: (
    transaction: Omit<Transaction, "id">,
  ) => ResultAsync<string, AppError>;
  updateTransactionAsync: (
    id: string,
    updates: Partial<Transaction>,
  ) => ResultAsync<void, AppError>;
  deleteTransactionAsync: (id: string) => ResultAsync<void, AppError>;
  fetchTransactionsAsync: (
    params?: Record<string, unknown>,
  ) => ResultAsync<void, AppError>;

  // クエリ（Result型対応）
  getTransactionById: (id: string) => Result<Transaction, BusinessError>;
  getTransactionsByType: (
    type: TransactionType,
  ) => Result<Transaction[], BusinessError>;
  getRecentTransactions: (
    limit?: number,
  ) => Result<Transaction[], BusinessError>;
  getTransactionsByDateRange: (
    startDate: string,
    endDate: string,
  ) => Result<Transaction[], BusinessError>;
  getTransactionsWithEcoContribution: () => Result<
    Transaction[],
    BusinessError
  >;
  getTotalEcoContribution: () => Result<number, BusinessError>;

  // ユーティリティ
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Transaction スライスの作成関数（Result型対応）
 */
export const createTransactionSlice: StateCreator<
  TransactionSlice,
  [],
  [],
  TransactionSlice
> = (set, get) => ({
  // 初期状態
  transactions: transactionsData,
  isLoading: false,
  error: null,

  // 新しい取引を追加（Result型対応）
  addTransaction: (transaction) => {
    try {
      // バリデーション
      if (!transaction.amount || transaction.amount <= 0) {
        return err({
          type: "PAYMENT_FAILED",
          message: "取引金額が無効です",
          reason: `無効な金額: ${transaction.amount}`,
          paymentId: undefined,
        });
      }

      const amountValidation = validateTransactionAmount(
        transaction.amount,
        transaction.type,
      );
      if (amountValidation.isErr()) {
        return err(amountValidation.error);
      }

      const id = `txn_${Date.now().toString(36)}`;
      const newTransaction = { id, ...transaction };

      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        error: null,
      }));

      return ok(id);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引の追加に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 非同期で取引を追加（API統合）
  addTransactionAsync: (transaction) => {
    return ResultAsync.fromSafePromise(
      (async () => {
        set({ isLoading: true, error: null });

        const createRequest = {
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description || "",
          ecoContribution: transaction.ecoContribution,
        };

        const apiResult = await createTransaction(createRequest);

        if (apiResult.isErr()) {
          const error: AppError = apiResult.error;
          set({ isLoading: false, error });
          throw error;
        }

        const newTransaction = apiResult.value;
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          isLoading: false,
          error: null,
        }));

        return newTransaction.id;
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

  // 取引を更新（API統合）
  updateTransactionAsync: (id, updates) => {
    return ResultAsync.fromSafePromise(
      (async () => {
        set({ isLoading: true, error: null });

        const updateRequest = {
          description: updates.description,
          ecoContribution: updates.ecoContribution,
        };

        const apiResult = await updateTransaction(id, updateRequest);

        if (apiResult.isErr()) {
          const error: AppError = apiResult.error;
          set({ isLoading: false, error });
          throw error;
        }

        const updatedTransaction = apiResult.value;
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? updatedTransaction : t,
          ),
          isLoading: false,
          error: null,
        }));
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

  // 取引を削除（API統合）
  deleteTransactionAsync: (id) => {
    return ResultAsync.fromSafePromise(
      (async () => {
        set({ isLoading: true, error: null });

        const apiResult = await deleteTransaction(id);

        if (apiResult.isErr()) {
          const error: AppError = apiResult.error;
          set({ isLoading: false, error });
          throw error;
        }

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          isLoading: false,
          error: null,
        }));
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

  // 取引一覧を取得（API統合）
  fetchTransactionsAsync: (params = {}) => {
    return ResultAsync.fromSafePromise(
      (async () => {
        set({ isLoading: true, error: null });

        const apiResult = await fetchTransactions(params);

        if (apiResult.isErr()) {
          const error: AppError = apiResult.error;
          set({ isLoading: false, error });
          throw error;
        }

        const transactionsResponse = apiResult.value;
        set({
          transactions: transactionsResponse.transactions,
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

  // IDで取引を検索（Result型対応）
  getTransactionById: (id) => {
    try {
      if (!id || id.trim() === "") {
        return err({
          type: "PAYMENT_FAILED",
          message: "取引IDが無効です",
          reason: `空のID: ${id}`,
          paymentId: undefined,
        });
      }

      const transaction = get().transactions.find(
        (transaction) => transaction.id === id,
      );

      if (!transaction) {
        return err({
          type: "PAYMENT_FAILED",
          message: "取引が見つかりません",
          reason: `取引ID: ${id}`,
          paymentId: undefined,
        });
      }

      return ok(transaction);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引の検索に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // タイプで取引をフィルタリング（Result型対応）
  getTransactionsByType: (type) => {
    try {
      const transactions = filterTransactionsByType(get().transactions, type);
      return ok(transactions);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引のフィルタリングに失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 最近の取引を取得（Result型対応）
  getRecentTransactions: (limit = 5) => {
    try {
      if (limit <= 0) {
        return err({
          type: "PAYMENT_FAILED",
          message: "制限数は0より大きい値である必要があります",
          reason: `無効な制限数: ${limit}`,
          paymentId: undefined,
        });
      }

      const transactions = getRecentTransactions(get().transactions, limit);
      return ok(transactions);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "最近の取引の取得に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 日付範囲で取引をフィルタリング（Result型対応）
  getTransactionsByDateRange: (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        return err({
          type: "PAYMENT_FAILED",
          message: "開始日と終了日は必須です",
          reason: `startDate: ${startDate}, endDate: ${endDate}`,
          paymentId: undefined,
        });
      }

      const transactions = filterTransactionsByDateRange(
        get().transactions,
        startDate,
        endDate,
      );
      return ok(transactions);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "日付範囲での取引フィルタリングに失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 環境貢献のある取引を取得（Result型対応）
  getTransactionsWithEcoContribution: () => {
    try {
      const transactions = filterTransactionsWithEcoContribution(
        get().transactions,
      );
      return ok(transactions);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "環境貢献取引の取得に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 環境貢献の合計を計算（Result型対応）
  getTotalEcoContribution: () => {
    try {
      const total = calculateTotalEcoContribution(get().transactions);
      return ok(total);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "環境貢献合計の計算に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // エラーをクリア
  clearError: () => {
    set({ error: null });
  },

  // ローディング状態を設定
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
});

/**
 * 単独で使用可能な Transaction ストアフック
 */
export const useTransactionStore = create<TransactionSlice>()((...a) => ({
  ...createTransactionSlice(...a),
}));
