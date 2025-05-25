/**
 * このファイルは後方互換性のために存在します。
 * 新しいコードでは以下の直接インポートを推奨します：
 * - 型定義: @/types/transaction
 * - モックデータ: @/lib/mock-data/transactions-data
 */

// 型定義をリエクスポート
export type { Transaction, TransactionType } from "@/shared/types/transaction";

// モックデータをリエクスポート
export { transactionsData } from "@/features/transactions/data/transactions-data";
