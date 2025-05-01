import { BalanceCard } from "@/components/cards/BalanceCard";
import { EcoImpactCard } from "@/components/cards/EcoImpactCard";
import { InviteCard } from "@/components/cards/InviteCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { NewsAndProjects } from "@/components/eco/NewsAndProjects";
import { RecommendedAction } from "@/components/eco/RecommendedAction";
import { TransactionEcoImpact } from "@/components/eco/TransactionEcoImpact";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recommendedActions } from "@/lib/mock-data/recommended-actions";
import { FeaturedCampaignCard } from "@/components/cards/FeaturedCampaignCard";
import { transactionsData } from "@/lib/mock-data/transactions";
import { Leaf } from "lucide-react";

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

  // 最新の環境貢献取引を取得
  const latestEcoTransaction = transactionsData
    .filter((t) => t.ecoContribution?.enabled)
    .sort((a, b) => {
      // 日付を比較して最新のものを取得
      const dateA = new Date(a.date.replace(/\//g, "-"));
      const dateB = new Date(b.date.replace(/\//g, "-"));
      return dateB.getTime() - dateA.getTime();
    })[0];

  return (
    <PageContainer activeTab="home">
      <BalanceCard />
      <EcoImpactCard ecoRank={session?.user?.ecoRank || "エコマイスター"} />

      {/* 最新の環境貢献取引の詳細表示 - 視覚的に強化 */}
      {latestEcoTransaction && latestEcoTransaction.ecoContribution && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-stone-800 mb-2 flex items-center">
            <Leaf className="h-4 w-4 mr-1 text-teal-600" />
            最近の環境貢献
          </h3>
          <TransactionEcoImpact
            contributionAmount={latestEcoTransaction.ecoContribution.amount}
            showLink={true}
          />
        </div>
      )}

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
