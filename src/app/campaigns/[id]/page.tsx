"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  Calendar,
  Tag,
  Info,
  ChevronRight,
  ArrowLeft,
  TreePine,
  Droplets,
  Globe,
  Users,
  Gift,
} from "lucide-react";
import { useCampaignStore } from "@/stores/campaignStore";
import { Campaign } from "@/lib/mock-data/campaigns";

import { calculateDateDifference } from "@/lib/utils/format";
import { calculateProgressPercent } from "@/lib/utils/eco-impact";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  // キャンペーンストアからデータを取得
  const getCampaignById = useCampaignStore((state) => state.getCampaignById);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    // キャンペーンデータの取得をシミュレート
    const fetchData = async () => {
      setLoading(true);

      try {
        // 実際のAPIリクエストの代わりにモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 300)); // 遅延を追加

        const data = getCampaignById(campaignId);
        if (data) {
          setCampaign(data);

          // 残り日数を計算 - ユーティリティ関数を使用
          const diffDays = calculateDateDifference(data.endDate);
          setDaysLeft(diffDays > 0 ? diffDays : 0);

          // 進捗率を計算 - ユーティリティ関数を使用
          const totalDays = calculateDateDifference(
            data.endDate,
            data.startDate,
          );
          const passedDays = calculateDateDifference(
            new Date(),
            data.startDate,
          );
          const progress = calculateProgressPercent(passedDays, totalDays);
          setProgressPercent(progress);
        }
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, getCampaignById]);

  // キャンペーンタイプに応じたアイコンを取得
  const getCampaignIcon = (type: string) => {
    switch (type) {
      case "eco":
        return <Leaf className="h-6 w-6 text-teal-600" />;
      case "point":
        return <Gift className="h-6 w-6 text-amber-500" />;
      case "referral":
        return <Users className="h-6 w-6 text-blue-500" />;
      default:
        return <Info className="h-6 w-6 text-stone-500" />;
    }
  };

  if (loading) {
    return (
      <PageContainer title="キャンペーン詳細">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-700"></div>
        </div>
      </PageContainer>
    );
  }

  if (!campaign) {
    return (
      <PageContainer title="キャンペーン詳細">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-stone-800">
            キャンペーンが見つかりませんでした
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            このキャンペーンは終了したか、存在しません。
          </p>
          <Button
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white"
            onClick={() => router.push("/campaigns")}
          >
            キャンペーン一覧に戻る
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="キャンペーン詳細">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
      </div>

      <Card className="border-0 shadow-md bg-white overflow-hidden">
        {/* キャンペーンヘッダー */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 p-6 text-white">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              {getCampaignIcon(campaign.type)}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{campaign.title}</h1>
              <p className="text-sm opacity-90">{campaign.subtitle}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-xs">
                {campaign.startDate} 〜 {campaign.endDate}
              </span>
            </div>
            {campaign.badgeText && (
              <Badge className="bg-white text-amber-600">
                {campaign.badgeText}
              </Badge>
            )}
          </div>

          {/* 期間プログレスバー */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>キャンペーン進行状況</span>
              <span>{daysLeft > 0 ? `残り${daysLeft}日` : "終了"}</span>
            </div>
            <Progress value={progressPercent} className="bg-white/30" />
          </div>
        </div>

        {/* キャンペーン詳細 */}
        <div className="p-6 space-y-6">
          {/* 概要 */}
          <div>
            <h2 className="text-lg font-medium text-stone-800 mb-2">
              キャンペーン概要
            </h2>
            <p className="text-sm text-stone-600">{campaign.description}</p>
          </div>

          <Separator />

          {/* 特典内容 */}
          <div>
            <h2 className="text-lg font-medium text-stone-800 mb-2">
              特典内容
            </h2>
            {campaign.pointRate && (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mb-3">
                <div className="flex items-center text-amber-800">
                  <Tag className="h-5 w-5 mr-2" />
                  <span className="text-lg font-bold">
                    {campaign.pointRate}%ポイント還元
                  </span>
                </div>
              </div>
            )}
            <p className="text-sm text-stone-600">
              {campaign.benefitDescription}
            </p>
          </div>

          {/* 適用条件 */}
          <div>
            <h2 className="text-lg font-medium text-stone-800 mb-2">
              適用条件
            </h2>
            <ul className="space-y-2">
              {campaign.conditions.map((condition, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-xs text-amber-800 mr-2 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-stone-600">{condition}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* 参加方法 */}
          {campaign.steps && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-medium text-stone-800 mb-2">
                  参加方法
                </h2>
                <div className="space-y-3">
                  {campaign.steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs text-teal-800 mr-3">
                        {index + 1}
                      </div>
                      <p className="text-sm text-stone-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 環境貢献情報 */}
          {campaign.ecoImpact && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-medium text-stone-800 mb-2">
                  {campaign.ecoImpact.title}
                </h2>
                <div className="bg-teal-50 p-4 rounded-md border border-teal-100">
                  <p className="text-sm text-teal-700 mb-3">
                    {campaign.ecoImpact.description}
                  </p>

                  {campaign.ecoImpact.metrics && (
                    <div className="grid grid-cols-2 gap-3">
                      {campaign.ecoImpact.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-white bg-opacity-60 p-3 rounded-md"
                        >
                          <div className="flex items-center mb-1">
                            {metric.icon === "tree" && (
                              <TreePine className="h-4 w-4 text-teal-600 mr-1" />
                            )}
                            {metric.icon === "water" && (
                              <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                            )}
                            {metric.icon === "globe" && (
                              <Globe className="h-4 w-4 text-green-600 mr-1" />
                            )}
                            <span className="text-xs text-stone-600">
                              {metric.label}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-teal-700">
                            {metric.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 関連商品 */}
          {campaign.relatedItems && campaign.relatedItems.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-medium text-stone-800 mb-2">
                  関連商品
                </h2>
                <div className="space-y-3">
                  {campaign.relatedItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-stone-200 p-3 rounded-md"
                    >
                      <h3 className="text-sm font-medium text-stone-800">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* アクションボタン */}
          <div className="mt-6">
            <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
              キャンペーンに参加する
            </Button>
            {campaign.type === "referral" && (
              <Button
                variant="outline"
                className="w-full mt-3 border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => router.push("/invite")}
              >
                友達を招待する
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
