"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Leaf,
  ShoppingBag,
  Megaphone,
  AlertTriangle,
  Bell,
} from "lucide-react";
import {
  notificationsData,
  Notification,
  NotificationType,
} from "@/lib/mock-data/notifications";
import { NotificationCampaignCard } from "@/components/campaigns/NotificationCampaignCard";

interface NotificationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NotificationDetailPage({
  params,
}: NotificationDetailPageProps) {
  const unwrappedParams = use(params);

  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 実際の実装ではAPIからデータを取得する
    const foundNotification = notificationsData.find(
      (n) => n.id === unwrappedParams.id,
    );
    setNotification(foundNotification || null);
    setLoading(false);

    // 既読に設定（実際の実装ではAPIを呼び出す）
    if (foundNotification && !foundNotification.isRead) {
      // APIでの既読更新処理をここに記述
    }
  }, [unwrappedParams.id]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "transaction":
        return <ShoppingBag className="h-6 w-6 text-blue-500" />;
      case "eco_impact":
        return <Leaf className="h-6 w-6 text-teal-600" />;
      case "campaign":
        return <Megaphone className="h-6 w-6 text-amber-500" />;
      case "security":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "system":
      default:
        return <Bell className="h-6 w-6 text-stone-500" />;
    }
  };

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case "transaction":
        return "bg-blue-50";
      case "eco_impact":
        return "bg-teal-50";
      case "campaign":
        return "bg-amber-50";
      case "security":
        return "bg-red-50";
      case "system":
      default:
        return "bg-stone-50";
    }
  };

  if (loading) {
    return (
      <PageContainer title="通知の詳細">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-700"></div>
        </div>
      </PageContainer>
    );
  }

  if (!notification) {
    return (
      <PageContainer title="通知の詳細">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-stone-800">
            通知が見つかりませんでした
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            この通知は削除されたか、存在しません。
          </p>
          <Button
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white"
            onClick={() => router.push("/notifications")}
          >
            通知一覧に戻る
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="通知の詳細">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-600"
          onClick={() => router.push("/notifications")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          通知一覧に戻る
        </Button>
      </div>

      <Card className="border-0 shadow-md bg-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${getBackgroundColor(notification.type)}`}
            >
              {getNotificationIcon(notification.type)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-800">
                {notification.title}
              </h1>
              <p className="text-xs text-stone-500">{notification.date}</p>
            </div>
          </div>

          <div className="text-sm text-stone-700 leading-relaxed">
            <p>{notification.message}</p>

            {notification.type === "eco_impact" && (
              <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                <h3 className="text-sm font-medium text-teal-800 mb-2">
                  環境貢献の詳細
                </h3>
                <ul className="text-xs text-teal-700 space-y-1 list-disc pl-4">
                  <li>今月の環境保全活動への寄付: ¥850</li>
                  <li>これまでの累計寄付額: ¥12,450</li>
                  <li>保全された森林面積: 5.2 m²</li>
                  <li>削減されたCO2排出量: 25kg</li>
                </ul>
                <Button
                  className="w-full mt-3 bg-teal-700 hover:bg-teal-800 text-white text-xs"
                  onClick={() => router.push("/impact")}
                >
                  環境インパクト詳細を見る
                </Button>
              </div>
            )}

            {notification.type === "transaction" && (
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">金額</span>
                  <span className="font-medium text-stone-800">¥4,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">環境保全寄付</span>
                  <span className="font-medium text-teal-700">¥200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">日時</span>
                  <span className="font-medium text-stone-800">
                    2025/04/19 12:30
                  </span>
                </div>
                <Button
                  className="w-full mt-1 bg-teal-700 hover:bg-teal-800 text-white text-xs"
                  onClick={() => router.push("/history")}
                >
                  取引履歴を見る
                </Button>
              </div>
            )}

            {notification.type === "campaign" && (
              <div className="mt-4 space-y-3">
                <NotificationCampaignCard campaignId="camp_1" />
              </div>
            )}

            {notification.type === "security" && (
              <div className="mt-4 space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    セキュリティ情報
                  </h3>
                  <p className="text-xs text-red-700">
                    新しいデバイス（iPhone 13 Pro）からログインがありました。
                    ログイン時間: 2025/04/12 08:23 場所: 東京都渋谷区
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs"
                      onClick={() => router.push("/settings?tab=security")}
                    >
                      不審なログインを報告
                    </Button>
                    <Button className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs">
                      問題ありません
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
