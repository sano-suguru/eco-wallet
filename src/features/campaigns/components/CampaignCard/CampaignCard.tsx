"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ChevronRight, Users, Leaf, Gift } from "lucide-react";
import { Campaign } from "../../types/campaign";
import { cn } from "@/lib/utils";

/**
 * キャンペーンカードのプロパティ
 */
export interface CampaignCardProps {
  campaign: Campaign;
  variant?: "featured" | "referral" | "notification";
  className?: string;
  buttonText?: string;
  showButton?: boolean;
}

/**
 * キャンペーン情報を表示するカードコンポーネント
 *
 * @param campaign キャンペーン情報
 * @param variant 表示バリアント
 * @param className 追加のCSSクラス
 * @param buttonText ボタンのテキスト
 * @param showButton ボタン表示フラグ
 */
export function CampaignCard({
  campaign,
  variant = "featured",
  className = "",
  buttonText = "キャンペーン詳細を見る",
  showButton = true,
}: CampaignCardProps) {
  if (!campaign) return null;

  /**
   * キャンペーンタイプに基づいたアイコンを取得
   */
  const getIcon = () => {
    switch (campaign.type) {
      case "eco":
        return <Leaf className="h-5 w-5" />;
      case "referral":
        return <Users className="h-5 w-5" />;
      case "point":
        return <Gift className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  /**
   * キャンペーンタイプに基づいたグラデーション背景を取得
   */
  const getGradientBg = () => {
    switch (campaign.type) {
      case "eco":
        return "from-teal-100 to-teal-100/70";
      case "referral":
        return "from-blue-50 to-blue-100";
      case "point":
        return "from-amber-100 to-amber-100/70";
      default:
        return "from-amber-100 to-amber-100/70";
    }
  };

  /**
   * キャンペーンタイプに基づいたアイコン背景を取得
   */
  const getIconBg = () => {
    switch (campaign.type) {
      case "eco":
        return "bg-teal-600 text-white";
      case "referral":
        return "bg-blue-600 text-white";
      case "point":
        return "bg-amber-600 text-white";
      default:
        return "bg-amber-600 text-white";
    }
  };

  /**
   * キャンペーンタイプに基づいたボタンスタイルを取得
   */
  const getButtonStyle = () => {
    switch (campaign.type) {
      case "eco":
        return "bg-teal-600 hover:bg-teal-700 text-white";
      case "referral":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "point":
        return "bg-amber-600 hover:bg-amber-700 text-white";
      default:
        return "bg-amber-600 hover:bg-amber-700 text-white";
    }
  };

  /**
   * 通知バリアント用の詳細コンテンツを取得
   */
  const getNotificationContent = () => {
    if (variant !== "notification") return null;

    return (
      <div className="bg-amber-100 p-4 rounded-lg mt-3 eco-transition hover:bg-amber-100/80">
        <h3 className="text-sm font-medium text-amber-700 mb-2">
          キャンペーン詳細
        </h3>
        <p className="text-xs text-amber-600">
          {campaign.title}期間中（{campaign.startDate}〜{campaign.endDate}）
          {campaign.pointRate
            ? `にエコ製品を購入すると、購入金額の${campaign.pointRate}%がEcoポイントとして還元されます。`
            : campaign.description}
        </p>
      </div>
    );
  };

  return (
    <Card
      className={cn(
        `border-0 shadow-md bg-gradient-to-r ${getGradientBg()} eco-transition hover:shadow-lg rounded-lg`,
        className,
      )}
    >
      <div className="p-4 flex items-start space-x-3">
        <div className={`p-2 rounded-full ${getIconBg()} eco-transition`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-stone-800">
            {campaign.title}
          </h3>
          <p className="text-xs text-stone-700 mt-1">
            {campaign.subtitle || campaign.description}
          </p>

          {/* 通知バリアント用の詳細情報 */}
          {getNotificationContent()}

          {showButton && (
            <Link href={`/campaigns/${campaign.id}`}>
              <Button
                className={`mt-3 w-full ${getButtonStyle()} eco-transition h-10 rounded-md font-medium`}
              >
                {buttonText}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
