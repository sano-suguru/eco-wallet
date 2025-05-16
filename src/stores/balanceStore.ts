/**
 * @file balanceStore.ts
 * @deprecated このファイルは後方互換性のためにのみ存在します。
 * 今後は `src/stores/slices/balance.ts` から直接インポートすることを推奨します。
 */

import { useBalanceStore as useStore } from "./slices/balance";

// 後方互換性のためにそのまま再エクスポート
export { useBalanceStore } from "./slices/balance";

// 型定義の再エクスポート
export type { BalanceSlice as BalanceState } from "./slices/balance";

// 旧バージョンのAPIと完全な互換性を保証
export { useStore };
