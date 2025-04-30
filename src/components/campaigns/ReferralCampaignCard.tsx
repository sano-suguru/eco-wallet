"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight } from "lucide-react";
import { useCampaignStore } from "@/stores/campaignStore";

export function ReferralCampaignCard() {
  const getCampaignsByType = useCampaignStore(
    (state) => state.getCampaignsByType,
  );
  const referralCampaigns = getCampaignsByType("referral");
  const campaign = referralCampaigns.length > 0 ? referralCampaigns[0] : null;

  if (!campaign) return null;

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100 mb-6">
      <div className="p-4 flex items-start space-x-3">
        <div className="bg-blue-500 text-white p-2 rounded-full">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-stone-800">
            {campaign.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            {campaign.subtitle || campaign.description}
          </p>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white w-full">
              キャンペーン詳細を見る
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
