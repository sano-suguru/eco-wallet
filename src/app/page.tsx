import { BalanceCard } from "@/components/cards/BalanceCard";
import { EcoImpactCard } from "@/components/cards/EcoImpactCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { NewsAndProjects } from "@/components/eco/NewsAndProjects";
import { RecommendedAction } from "@/components/eco/RecommendedAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <PageContainer activeTab="home">
      <BalanceCard />

      <EcoImpactCard ecoRank={session?.user?.ecoRank || "エコマイスター"} />

      <RecentTransactions limit={3} />

      <NewsAndProjects />

      <RecommendedAction
        title="今月のおすすめアクション"
        description="決済額からの環境貢献を3%に増やすと、1ヶ月で森林保全面積を約2m²追加できます。"
        actionLabel="環境貢献を増やす"
        actionLink="/settings?tab=eco"
      />
    </PageContainer>
  );
}
