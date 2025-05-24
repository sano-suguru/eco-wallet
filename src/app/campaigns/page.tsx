"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  Zap,
  Calendar,
  ChevronRight,
  Users,
  Filter,
  Tag,
  Gift,
} from "lucide-react";
import { useCampaignStore } from "@/features/campaigns/store/campaign.slice";
import { PageContainer } from "@/features/layout";
import { Campaign } from "@/lib/mock-data/campaigns";

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-stone-800">
          キャンペーン一覧
        </h2>
        <Button variant="ghost" size="sm" className="text-stone-600">
          <Filter className="h-4 w-4 mr-1" />
          絞り込み
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 bg-stone-100">
          <TabsTrigger value="all" className="text-xs">
            すべて
          </TabsTrigger>
          <TabsTrigger value="eco" className="text-xs">
            環境
          </TabsTrigger>
          <TabsTrigger value="referral" className="text-xs">
            招待
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </TabsContent>

        <TabsContent value="eco" className="space-y-4 mt-4">
          {ecoCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </TabsContent>

        <TabsContent value="referral" className="space-y-4 mt-4">
          {referralCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </TabsContent>
      </Tabs>
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

  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden">
      <div
        className={`bg-gradient-to-r ${
          campaign.type === "eco"
            ? "from-teal-700 to-teal-600"
            : campaign.type === "referral"
              ? "from-blue-600 to-blue-500"
              : "from-amber-600 to-amber-500"
        } p-3 text-white`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white/20 p-1.5 rounded-full mr-2">
              {getCampaignIcon(campaign.type)}
            </div>
            <h3 className="text-sm font-medium">{campaign.title}</h3>
          </div>
          {campaign.badgeText && (
            <Badge className="bg-white text-amber-600 text-xs">
              {campaign.badgeText}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-xs text-stone-600 line-clamp-2 mb-2">
          {campaign.subtitle || campaign.description}
        </p>

        <div className="flex items-center text-xs text-stone-500 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {campaign.startDate} 〜 {campaign.endDate}
            {daysLeft > 0 ? ` (残り${daysLeft}日)` : " (終了)"}
          </span>
        </div>

        {campaign.pointRate && (
          <div className="bg-amber-50 p-2 rounded-md text-sm text-amber-800 flex items-center mb-3">
            <Tag className="h-4 w-4 mr-1" />
            <span>
              ポイント還元率: <strong>{campaign.pointRate}%</strong>
            </span>
          </div>
        )}

        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-stone-500">進行状況</span>
            <span className="text-stone-600">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        <Link href={`/campaigns/${campaign.id}`}>
          <Button className="w-full text-xs bg-teal-700 hover:bg-teal-800 text-white">
            詳細を見る
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
