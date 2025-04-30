import { BalanceCard } from "@/components/cards/BalanceCard";
import { EcoImpactCard } from "@/components/cards/EcoImpactCard";
import { InviteCard } from "@/components/cards/InviteCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { NewsAndProjects } from "@/components/eco/NewsAndProjects";
import { RecommendedAction } from "@/components/eco/RecommendedAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recommendedActions } from "@/lib/mock-data/recommended-actions";
import { FeaturedCampaignCard } from "@/components/cards/FeaturedCampaignCard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // ランダムにアクションを選ぶ
  const getRandomAction = () => {
    // アクションの優先度に基づいた重み付け選択
    // 優先度が高い（数値が小さい）アクションが選ばれる確率を高くする
    const prioritySum = recommendedActions.reduce(
      (sum, action) => sum + 10 / action.priority,
      0,
    );
    let random = Math.random() * prioritySum;

    for (const action of recommendedActions) {
      random -= 10 / action.priority;
      if (random <= 0) {
        return action;
      }
    }

    // フォールバック：最初のアクションを返す
    return recommendedActions[0];
  };

  // ランダムに選択したアクション
  const randomAction = getRandomAction();

  return (
    <PageContainer activeTab="home">
      <BalanceCard />
      <EcoImpactCard ecoRank={session?.user?.ecoRank || "エコマイスター"} />
      <InviteCard />
      <RecentTransactions limit={3} />
      <FeaturedCampaignCard />
      <NewsAndProjects />
      <RecommendedAction
        actionId={randomAction.id}
        title={randomAction.title}
        description={randomAction.description}
        actionLabel={randomAction.actionLabel}
        actionLink={randomAction.actionLink}
      />
    </PageContainer>
  );
}
