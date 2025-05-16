/**
 * 取引関連のユーティリティ関数
 */
import { Transaction, TransactionType } from "@/lib/mock-data/transactions";

/**
 * 日付範囲で取引をフィルタリング
 */
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: string,
  endDate: string,
): Transaction[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
};

/**
 * タイプによる取引のフィルタリング
 */
export const filterTransactionsByType = (
  transactions: Transaction[],
  type: TransactionType,
): Transaction[] => {
  return transactions.filter((transaction) => transaction.type === type);
};

/**
 * 最近の取引を取得
 */
export const getRecentTransactions = (
  transactions: Transaction[],
  limit: number = 5,
): Transaction[] => {
  return transactions.slice(0, limit);
};

/**
 * 環境貢献のある取引のフィルタリング
 */
export const filterTransactionsWithEcoContribution = (
  transactions: Transaction[],
): Transaction[] => {
  return transactions.filter(
    (transaction) => transaction.ecoContribution?.enabled,
  );
};

/**
 * 環境貢献の合計額を計算
 */
export const calculateTotalEcoContribution = (
  transactions: Transaction[],
): number => {
  return transactions
    .filter((transaction) => transaction.ecoContribution?.enabled)
    .reduce(
      (total, transaction) =>
        total + (transaction.ecoContribution?.amount || 0),
      0,
    );
};
