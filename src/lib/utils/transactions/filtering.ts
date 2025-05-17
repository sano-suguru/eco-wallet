/**
 * トランザクションのフィルタリングと集計に関する関数
 */
import { Transaction, TransactionType } from "./types";

/**
 * 日付範囲で取引をフィルタリング
 * @param transactions トランザクション配列
 * @param startDate 開始日（文字列）
 * @param endDate 終了日（文字列）
 * @returns 日付範囲内のトランザクション配列
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: string,
  endDate: string,
): Transaction[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
}

/**
 * タイプによる取引のフィルタリング
 * @param transactions トランザクション配列
 * @param type トランザクションタイプ
 * @returns 指定されたタイプのトランザクション配列
 */
export function filterTransactionsByType(
  transactions: Transaction[],
  type: TransactionType,
): Transaction[] {
  return transactions.filter((transaction) => transaction.type === type);
}

/**
 * 最近の取引を取得
 * @param transactions トランザクション配列
 * @param limit 取得する件数（デフォルト: 5）
 * @returns 最近の取引（配列の先頭から指定件数）
 */
export function getRecentTransactions(
  transactions: Transaction[],
  limit: number = 5,
): Transaction[] {
  return transactions.slice(0, limit);
}

/**
 * 環境貢献のある取引のフィルタリング
 * @param transactions トランザクション配列
 * @returns 環境貢献が有効なトランザクション配列
 */
export function filterTransactionsWithEcoContribution(
  transactions: Transaction[],
): Transaction[] {
  return transactions.filter(
    (transaction) => transaction.ecoContribution?.enabled,
  );
}

/**
 * 環境貢献の合計額を計算
 * @param transactions トランザクション配列
 * @returns 環境貢献の合計金額
 */
export function calculateTotalEcoContribution(
  transactions: Transaction[],
): number {
  return transactions
    .filter((transaction) => transaction.ecoContribution?.enabled)
    .reduce(
      (total, transaction) =>
        total + (transaction.ecoContribution?.amount || 0),
      0,
    );
}
