"use client";

import { BalanceCardContainer } from "@/features/balance";
import { EcoImpactDisplay } from "@/features/eco-impact";
import { InviteCard } from "@/features/invite";
import { PageContainer } from "@/features/layout";
import { RecentTransactionsContainer } from "@/features/transactions";
import { recommendedActions } from "@/lib/mock-data/recommended-actions";
import { FeaturedCampaignSection } from "@/features/campaigns";
import { RecommendedAction } from "@/features/eco-impact";

// TODO: データのフェッチロジックをfeatures/balanceに移動する
export default function DashboardPage() {
  // TODO: 実際の環境貢献額を計算する
  const contributionAmount = 1500; // 仮の値

  return (
    <PageContainer>
      <BalanceCardContainer />
      <EcoImpactDisplay contributionAmount={contributionAmount} />
      <FeaturedCampaignSection />
      {recommendedActions.length > 0 && (
        <RecommendedAction actionId={recommendedActions[0].id} />
      )}
      <InviteCard />
      <RecentTransactionsContainer />
    </PageContainer>
  );
}
