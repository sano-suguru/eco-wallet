import { create } from "zustand";
import {
  transactionsData,
  Transaction,
  TransactionType,
} from "@/lib/mock-data/transactions";
import {
  filterTransactionsByDateRange,
  filterTransactionsByType,
  getRecentTransactions,
  filterTransactionsWithEcoContribution,
  calculateTotalEcoContribution,
} from "@/lib/utils/transaction-utils";

interface TransactionState {
  // データ
  transactions: Transaction[];

  // アクション
  addTransaction: (transaction: Omit<Transaction, "id">) => string;

  // クエリ
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  getTransactionsByDateRange: (
    startDate: string,
    endDate: string,
  ) => Transaction[];
  getTransactionsWithEcoContribution: () => Transaction[];
  getTotalEcoContribution: () => number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // 初期状態
  transactions: transactionsData,

  // 新しい取引を追加
  addTransaction: (transaction) => {
    const id = `txn_${Date.now().toString(36)}`;
    const newTransaction = { id, ...transaction };

    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));

    return id;
  },

  // IDで取引を検索
  getTransactionById: (id) => {
    return get().transactions.find((transaction) => transaction.id === id);
  },

  // タイプで取引をフィルタリング - ユーティリティ関数を使用
  getTransactionsByType: (type) => {
    return filterTransactionsByType(get().transactions, type);
  },

  // 最近の取引を取得 - ユーティリティ関数を使用
  getRecentTransactions: (limit = 5) => {
    return getRecentTransactions(get().transactions, limit);
  },

  // 日付範囲で取引をフィルタリング - ユーティリティ関数を使用
  getTransactionsByDateRange: (startDate, endDate) => {
    return filterTransactionsByDateRange(
      get().transactions,
      startDate,
      endDate,
    );
  },

  // 環境貢献のある取引を取得 - ユーティリティ関数を使用
  getTransactionsWithEcoContribution: () => {
    return filterTransactionsWithEcoContribution(get().transactions);
  },

  // 環境貢献の合計を計算 - ユーティリティ関数を使用
  getTotalEcoContribution: () => {
    return calculateTotalEcoContribution(get().transactions);
  },
}));
