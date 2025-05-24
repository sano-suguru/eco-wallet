"use client";

import BalanceCard from "@/components/cards/BalanceCard";
import { EcoImpactCard } from "@/components/cards/EcoImpactCard";
import { InviteCard } from "@/components/cards/InviteCard";
import { PageContainer } from "@/features/layout";
import { RecentTransactionsContainer } from "@/features/transactions";
import { recommendedActions } from "@/lib/mock-data/recommended-actions";
import { FeaturedCampaignSection } from "@/features/campaigns";
import { RecommendedAction } from "@/features/eco-impact";

// TODO: データのフェッチロジックをfeatures/balanceに移動する
export default function DashboardPage() {
  return (
    <PageContainer>
      <BalanceCard />
      <EcoImpactCard />
      <FeaturedCampaignSection />
      {recommendedActions.length > 0 && (
        <RecommendedAction actionId={recommendedActions[0].id} />
      )}
      <InviteCard />
      <RecentTransactionsContainer />
    </PageContainer>
  );
}
