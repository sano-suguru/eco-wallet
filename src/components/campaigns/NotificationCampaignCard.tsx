"use client";

import { useCampaignStore } from "@/stores/slices/campaign";
import { CampaignCard } from "@/components/campaigns/CampaignCard";

interface NotificationCampaignCardProps {
  // オプション：特定のキャンペーンIDを指定できるようにする
  campaignId?: string;
}

export function NotificationCampaignCard({
  campaignId,
}: NotificationCampaignCardProps) {
  const getCampaignById = useCampaignStore((state) => state.getCampaignById);
  const getActiveCampaigns = useCampaignStore(
    (state) => state.getActiveCampaigns,
  );

  // 指定されたIDまたはアクティブなキャンペーンの1つを使用
  const campaign = campaignId
    ? getCampaignById(campaignId)
    : getActiveCampaigns()[0];

  if (!campaign) return null;

  return (
    <CampaignCard
      campaign={campaign}
      variant="notification"
      buttonText="キャンペーン詳細を見る"
      className="p-0 bg-transparent shadow-none border-0"
    />
  );
}
