// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import {
  CampaignCard as NewCampaignCard,
  CampaignCardProps,
} from "@/features/campaigns";

// 元のコンポーネントと同じインターフェイスを維持
export function CampaignCard(props: CampaignCardProps) {
  // 新しいコンポーネントを使用
  return <NewCampaignCard {...props} />;
}
