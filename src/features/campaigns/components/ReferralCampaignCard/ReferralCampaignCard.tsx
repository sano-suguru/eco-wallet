"use client";

import { useCampaignStore, CampaignCard } from "@/features/campaigns";

export function ReferralCampaignCard() {
  const getCampaignsByType = useCampaignStore(
    (state) => state.getCampaignsByType,
  );
  const referralCampaigns = getCampaignsByType("referral");
  const campaign = referralCampaigns.length > 0 ? referralCampaigns[0] : null;

  if (!campaign) return null;

  return (
    <CampaignCard
      campaign={campaign}
      variant="referral"
      className="mb-6"
      buttonText="キャンペーン詳細を見る"
    />
  );
}
