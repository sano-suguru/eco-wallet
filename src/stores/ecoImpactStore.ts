/**
 * @file ecoImpactStore.ts
 * @deprecated このファイルは後方互換性のためにのみ存在します。
 * 今後は `src/stores/slices/ecoImpact.ts` から直接インポートすることを推奨します。
 */

import { useEcoImpactStore as useStore } from "./slices/ecoImpact";

// 後方互換性のためにそのまま再エクスポート
export { useEcoImpactStore } from "./slices/ecoImpact";

// 型定義の再エクスポート
export type { EcoImpactSlice as EcoImpactState } from "./slices/ecoImpact";

// 旧バージョンのAPIと完全な互換性を保証
export { useStore };
