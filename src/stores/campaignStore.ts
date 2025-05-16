/**
 * @file campaignStore.ts
 * @deprecated このファイルは後方互換性のためにのみ存在します。
 * 今後は `src/stores/slices/campaign.ts` から直接インポートすることを推奨します。
 */

import { useCampaignStore as useStore } from "./slices/campaign";

// 後方互換性のためにそのまま再エクスポート
export { useCampaignStore } from "./slices/campaign";

// 型定義の再エクスポート
export type { CampaignSlice as CampaignState } from "./slices/campaign";

// 旧バージョンのAPIと完全な互換性を保証
export { useStore };
