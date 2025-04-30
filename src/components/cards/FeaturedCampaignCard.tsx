"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, ChevronRight } from "lucide-react";
import { useCampaignStore } from "@/stores/campaignStore";

export function FeaturedCampaignCard() {
  const getPopularCampaigns = useCampaignStore(
    (state) => state.getPopularCampaigns,
  );

  // 人気のキャンペーンを取得（存在しない場合は最初の1つを選択）
  const popularCampaigns = getPopularCampaigns();
  const campaign = popularCampaigns.length > 0 ? popularCampaigns[0] : null;

  if (!campaign) return null;

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-amber-50 to-amber-100 p-4">
      <div className="flex items-start space-x-3">
        <div className="bg-amber-500 text-white p-2 rounded-full">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-stone-800">
            {campaign.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            {campaign.subtitle || campaign.description}
          </p>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button className="mt-3 bg-amber-500 hover:bg-amber-600 text-white w-full">
              キャンペーン詳細を見る
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
