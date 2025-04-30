"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCampaignStore } from "@/stores/campaignStore";

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
    <div className="bg-amber-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-amber-800 mb-2">
        キャンペーン詳細
      </h3>
      <p className="text-xs text-amber-700">
        {campaign.title}期間中（{campaign.startDate}〜{campaign.endDate}）
        {campaign.pointRate
          ? `にエコ製品を購入すると、購入金額の${campaign.pointRate}%がEcoポイントとして還元されます。`
          : campaign.description}
      </p>
      <Link href={`/campaigns/${campaign.id}`}>
        <Button className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white text-xs">
          キャンペーン詳細を見る
        </Button>
      </Link>
    </div>
  );
}
