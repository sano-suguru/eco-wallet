"use client";

import Link from "next/link";
import { BalanceCardContainer } from "@/features/balance";
import { EcoImpactDisplay } from "@/features/eco-impact";
import { InviteCard } from "@/features/invite";
import { PageContainer } from "@/features/layout";
import { RecentTransactionsContainer } from "@/features/transactions";
import { recommendedActions } from "@/features/eco-impact/data/recommended-actions-data";
import { FeaturedCampaignSection } from "@/features/campaigns";
import { RecommendedAction } from "@/features/eco-impact";

export default function DashboardPage() {
  const contributionAmount = 1500;

  return (
    <PageContainer>
      {/* ヘッダー部分のグリーティング */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">こんにちは！</h1>
        <p className="text-sm text-stone-600 mt-1">
          今日も環境に優しい一日を過ごしましょう
        </p>
      </div>

      {/* 残高カード */}
      <div className="mb-6">
        <BalanceCardContainer />
      </div>

      {/* 環境インパクトサマリー */}
      <div className="mb-6 bg-white rounded-lg border border-stone-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <EcoImpactDisplay
          contributionAmount={contributionAmount}
          variant="detailed"
          className="border-0 shadow-none"
        />
      </div>

      {/* キャンペーン情報 */}
      <div className="mb-6">
        <FeaturedCampaignSection />
      </div>

      {/* おすすめアクション */}
      {recommendedActions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">
            今週のおすすめアクション
          </h2>
          <RecommendedAction actionId={recommendedActions[0].id} />
        </div>
      )}

      {/* 友達招待カード */}
      <div className="mb-6">
        <InviteCard />
      </div>

      {/* 最近の取引 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-stone-800">最近の取引</h2>
          <Link
            href="/history"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
          >
            すべて見る →
          </Link>
        </div>
        <RecentTransactionsContainer />
      </div>
    </PageContainer>
  );
}
