/**
 * @file transactionStore.ts
 * @deprecated このファイルは後方互換性のためにのみ存在します。
 * 今後は `src/stores/slices/transaction.ts` から直接インポートすることを推奨します。
 */

import { useTransactionStore as useStore } from "./slices/transaction";

// 後方互換性のためにそのまま再エクスポート
export { useTransactionStore } from "./slices/transaction";

// 型定義の再エクスポート
export type { TransactionSlice as TransactionState } from "./slices/transaction";

// 旧バージョンのAPIと完全な互換性を保証
export { useStore };
