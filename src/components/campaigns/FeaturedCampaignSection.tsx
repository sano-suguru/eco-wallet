// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import { FeaturedCampaignSection as NewFeaturedCampaignSection } from "@/features/campaigns";

// 元のコンポーネントと同じインターフェイスを維持
export function FeaturedCampaignSection() {
  // 新しいコンポーネントを使用
  return <NewFeaturedCampaignSection />;
}
