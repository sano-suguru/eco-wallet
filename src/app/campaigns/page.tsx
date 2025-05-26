"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Leaf,
  Zap,
  Calendar,
  ChevronRight,
  Users,
  Filter,
  Tag,
  Gift,
  Clock,
  Flame,
  ArrowRight,
  Star,
} from "lucide-react";
import { useCampaignStore } from "@/features/campaigns/store/campaign.slice";
import { PageContainer } from "@/features/layout";
import { Campaign } from "@/features/campaigns/types/campaign";

export default function CampaignsPage() {
  const getActiveCampaigns = useCampaignStore(
    (state) => state.getActiveCampaigns,
  );
  const getCampaignsByType = useCampaignStore(
    (state) => state.getCampaignsByType,
  );

  const activeCampaigns = getActiveCampaigns();
  const ecoCampaigns = getCampaignsByType("eco");
  const referralCampaigns = getCampaignsByType("referral");

  return (
    <PageContainer title="キャンペーン">
      {/* ヘッダーセクション */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-600 -mx-4 -mt-4 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">キャンペーン</h1>
            <p className="text-teal-100 text-sm">
              参加してポイントを獲得し、環境に貢献しよう
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <Flame className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* キャンペーン統計 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-teal-100 text-xs">開催中</span>
              <Star className="h-4 w-4 text-amber-300" />
            </div>
            <p className="text-2xl font-bold text-white">
              {activeCampaigns.length}
            </p>
            <p className="text-teal-100 text-xs">キャンペーン</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-teal-100 text-xs">今月の参加</span>
              <Zap className="h-4 w-4 text-amber-300" />
            </div>
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-teal-100 text-xs">キャンペーン</p>
          </div>
        </div>
      </div>

      {/* フィルターボタン */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-stone-800">
          開催中のキャンペーン
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
        >
          <Filter className="h-4 w-4 mr-1" />
          絞り込み
        </Button>
      </div>

      {/* タブ */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 bg-stone-100 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm transition-all duration-200"
          >
            すべて
            <span className="ml-1 text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              {activeCampaigns.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="eco"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Leaf className="h-4 w-4 mr-1" />
            環境
            <span className="ml-1 text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              {ecoCampaigns.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="referral"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Users className="h-4 w-4 mr-1" />
            招待
            <span className="ml-1 text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              {referralCampaigns.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {activeCampaigns.length === 0 ? (
            <EmptyState />
          ) : (
            activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          )}
        </TabsContent>

        <TabsContent value="eco" className="space-y-4 mt-4">
          {ecoCampaigns.length === 0 ? (
            <EmptyState type="eco" />
          ) : (
            ecoCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          )}
        </TabsContent>

        <TabsContent value="referral" className="space-y-4 mt-4">
          {referralCampaigns.length === 0 ? (
            <EmptyState type="referral" />
          ) : (
            referralCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* おすすめキャンペーン */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-stone-800">
            おすすめキャンペーン
          </h3>
          <Badge className="bg-amber-600 text-white">期間限定</Badge>
        </div>
        <p className="text-sm text-stone-600 mb-3">
          今なら最大3倍のポイントが獲得できるキャンペーンを開催中！
        </p>
        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
          詳しく見る
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </PageContainer>
  );
}

// キャンペーンカードコンポーネント
function CampaignCard({ campaign }: { campaign: Campaign }) {
  // 残り日数を計算
  const endDate = new Date(campaign.endDate);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 進捗率を計算
  const startDate = new Date(campaign.startDate);
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const passedDays = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const progressPercent = Math.min(
    100,
    Math.max(0, (passedDays / totalDays) * 100),
  );

  // キャンペーンタイプに応じたアイコンを取得
  const getCampaignIcon = (type: string) => {
    switch (type) {
      case "eco":
        return <Leaf className="h-5 w-5 text-teal-600" />;
      case "point":
        return <Gift className="h-5 w-5 text-amber-500" />;
      case "referral":
        return <Users className="h-5 w-5 text-blue-500" />;
      default:
        return <Zap className="h-5 w-5 text-stone-500" />;
    }
  };

  // タイプに応じた背景色
  const getTypeColor = (type: string) => {
    switch (type) {
      case "eco":
        return "from-teal-700 to-teal-600";
      case "referral":
        return "from-blue-600 to-blue-500";
      case "point":
        return "from-amber-600 to-amber-500";
      default:
        return "from-stone-600 to-stone-500";
    }
  };

  return (
    <Card className="border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-200 overflow-hidden">
      <div className="flex">
        {/* 左側のタイプインジケーター */}
        <div
          className={`w-1.5 bg-gradient-to-b ${getTypeColor(campaign.type)}`}
        />

        <div className="flex-1">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${
                    campaign.type === "eco"
                      ? "from-teal-50 to-teal-100"
                      : campaign.type === "referral"
                        ? "from-blue-50 to-blue-100"
                        : "from-amber-50 to-amber-100"
                  }`}
                >
                  {getCampaignIcon(campaign.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 text-sm">
                    {campaign.title}
                  </h3>
                  {campaign.badgeText && (
                    <Badge
                      variant="secondary"
                      className="mt-1 text-xs bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-0"
                    >
                      {campaign.badgeText}
                    </Badge>
                  )}
                </div>
              </div>
              {campaign.isPopular && (
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  人気
                </div>
              )}
            </div>

            <p className="text-sm text-stone-600 line-clamp-2 mb-3">
              {campaign.subtitle || campaign.description}
            </p>

            {/* 期間と残り日数 */}
            <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {campaign.startDate} 〜 {campaign.endDate}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span
                  className={daysLeft <= 3 ? "text-red-600 font-medium" : ""}
                >
                  {daysLeft > 0 ? `残り${daysLeft}日` : "終了"}
                </span>
              </div>
            </div>

            {/* ポイント還元率 */}
            {campaign.pointRate && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-2.5 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      ポイント還元率
                    </span>
                  </div>
                  <span className="text-lg font-bold text-amber-800">
                    {campaign.pointRate}%
                  </span>
                </div>
              </div>
            )}

            {/* 進捗バー */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-500">キャンペーン進行状況</span>
                <span className="text-stone-600 font-medium">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getTypeColor(campaign.type)} transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* アクションボタン */}
            <Link href={`/campaigns/${campaign.id}`}>
              <Button className="w-full bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white transition-all duration-200">
                詳細を見る
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 空状態コンポーネント
function EmptyState({ type }: { type?: string }) {
  const getEmptyMessage = () => {
    switch (type) {
      case "eco":
        return "現在、環境キャンペーンは開催されていません。";
      case "referral":
        return "現在、招待キャンペーンは開催されていません。";
      default:
        return "現在、開催中のキャンペーンはありません。";
    }
  };

  return (
    <div className="bg-stone-50 rounded-lg p-8 text-center">
      <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap className="h-8 w-8 text-stone-400" />
      </div>
      <p className="text-stone-600 text-sm mb-4">{getEmptyMessage()}</p>
      <p className="text-stone-500 text-xs">
        新しいキャンペーンが始まり次第、お知らせします。
      </p>
    </div>
  );
}
