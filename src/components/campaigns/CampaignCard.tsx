import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ChevronRight, Users, Leaf, Gift } from "lucide-react";
import { Campaign } from "@/lib/mock-data/campaigns";

interface CampaignCardProps {
  campaign: Campaign;
  variant?: "featured" | "referral" | "notification";
  className?: string;
  buttonText?: string;
  showButton?: boolean;
}

export function CampaignCard({
  campaign,
  variant = "featured",
  className = "",
  buttonText = "キャンペーン詳細を見る",
  showButton = true,
}: CampaignCardProps) {
  if (!campaign) return null;

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

  const getGradientBg = () => {
    switch (campaign.type) {
      case "eco":
        return "from-teal-50 to-teal-100";
      case "referral":
        return "from-blue-50 to-blue-100";
      case "point":
        return "from-amber-50 to-amber-100";
      default:
        return "from-amber-50 to-amber-100";
    }
  };

  const getIconBg = () => {
    switch (campaign.type) {
      case "eco":
        return "bg-teal-600 text-white";
      case "referral":
        return "bg-blue-500 text-white";
      case "point":
        return "bg-amber-500 text-white";
      default:
        return "bg-amber-500 text-white";
    }
  };

  const getButtonStyle = () => {
    switch (campaign.type) {
      case "eco":
        return "bg-teal-700 hover:bg-teal-800 text-white";
      case "referral":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "point":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      default:
        return "bg-amber-500 hover:bg-amber-600 text-white";
    }
  };

  // 通知バリアントの場合、詳細情報
  const getNotificationContent = () => {
    if (variant !== "notification") return null;

    return (
      <div className="bg-amber-50 p-4 rounded-lg mt-3">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          キャンペーン詳細
        </h3>
        <p className="text-xs text-amber-700">
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
      className={`border-0 shadow-md bg-gradient-to-r ${getGradientBg()} ${className}`}
    >
      <div className="p-4 flex items-start space-x-3">
        <div className={`p-2 rounded-full ${getIconBg()}`}>{getIcon()}</div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-stone-800">
            {campaign.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            {campaign.subtitle || campaign.description}
          </p>

          {/* 通知バリアント用の詳細情報 */}
          {getNotificationContent()}

          {showButton && (
            <Link href={`/campaigns/${campaign.id}`}>
              <Button className={`mt-3 w-full ${getButtonStyle()}`}>
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
