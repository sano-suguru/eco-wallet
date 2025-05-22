// キャンペーン機能の公開API

// 型定義のエクスポート
export * from "./types/campaign";

// ストアのエクスポート
export { useCampaignStore } from "./store/campaign.slice";
export type { CampaignSlice } from "./store/campaign.slice";

// ユーティリティ関数のエクスポート
export {
  findCampaignById,
  filterActiveCampaigns,
  filterPopularCampaigns,
  filterCampaignsByType,
} from "./utils/campaign-utils";

// コンポーネントのエクスポート
export { CampaignCard } from "./components/CampaignCard";
export type { CampaignCardProps } from "./components/CampaignCard";
export { FeaturedCampaignSection } from "./components/FeaturedCampaign";

// データのエクスポート（必要に応じて）
export { campaignsData } from "./data/campaigns-data";
