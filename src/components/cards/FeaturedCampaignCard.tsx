"use client";

import { useCampaignStore, CampaignCard } from "@/features/campaigns";

export function FeaturedCampaignCard() {
  const getPopularCampaigns = useCampaignStore(
    (state) => state.getPopularCampaigns,
  );

  // 人気のキャンペーンを取得（存在しない場合は最初の1つを選択）
  const popularCampaigns = getPopularCampaigns();
  const campaign = popularCampaigns.length > 0 ? popularCampaigns[0] : null;

  if (!campaign) return null;

  return (
    <CampaignCard
      campaign={campaign}
      variant="featured"
      buttonText="キャンペーン詳細を見る"
    />
  );
}
