import { create } from "zustand";
import {
  transactionsData,
  Transaction,
  TransactionType,
} from "@/lib/mock-data/transactions";

interface TransactionState {
  // 取引履歴データ
  transactions: Transaction[];

  // アクション
  addTransaction: (transaction: Omit<Transaction, "id">) => string;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  filterTransactionsByDateRange: (
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

  // タイプで取引をフィルタリング
  getTransactionsByType: (type) => {
    return get().transactions.filter(
      (transaction) => transaction.type === type,
    );
  },

  // 最近の取引を取得
  getRecentTransactions: (limit = 5) => {
    return get().transactions.slice(0, limit);
  },

  // 日付範囲で取引をフィルタリング
  filterTransactionsByDateRange: (startDate, endDate) => {
    // 日付文字列をDateオブジェクトに変換
    const start = new Date(startDate);
    const end = new Date(endDate);

    return get().transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  },

  // 環境貢献のある取引を取得
  getTransactionsWithEcoContribution: () => {
    return get().transactions.filter(
      (transaction) => transaction.ecoContribution?.enabled,
    );
  },

  // 環境貢献の合計を計算
  getTotalEcoContribution: () => {
    return get()
      .transactions.filter(
        (transaction) => transaction.ecoContribution?.enabled,
      )
      .reduce(
        (total, transaction) =>
          total + (transaction.ecoContribution?.amount || 0),
        0,
      );
  },
}));
