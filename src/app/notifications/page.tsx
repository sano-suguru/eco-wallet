"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Leaf,
  ShoppingBag,
  Megaphone,
  AlertTriangle,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  notificationsData,
  Notification,
  NotificationType,
} from "@/lib/mock-data/notifications";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState(notificationsData);

  // 未読の通知数をカウント
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 通知をクリックしたときの処理
  const handleNotificationClick = (notification: Notification) => {
    // 未読を既読に変更
    if (!notification.isRead) {
      const updatedNotifications = notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n,
      );
      setNotifications(updatedNotifications);
    }

    // リンクがあればリダイレクト
    if (notification.link) {
      router.push(notification.link);
    } else {
      // 詳細ページがあれば詳細ページに遷移
      router.push(`/notifications/${notification.id}`);
    }
  };

  // フィルタリングされた通知の取得
  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications;
    }
    return notifications.filter((n) => n.type === activeTab);
  };

  // 通知タイプに基づいてアイコンを取得
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "transaction":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case "eco_impact":
        return <Leaf className="h-5 w-5 text-teal-600" />;
      case "campaign":
        return <Megaphone className="h-5 w-5 text-amber-500" />;
      case "security":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "system":
      default:
        return <Bell className="h-5 w-5 text-stone-500" />;
    }
  };

  // すべての通知を既読にする
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <PageContainer title="通知" showNotifications={false}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-stone-800 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-stone-600" />
          通知
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-teal-100 text-teal-800">
              {unreadCount}件の未読
            </Badge>
          )}
        </h2>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-stone-600"
            onClick={markAllAsRead}
          >
            すべて既読にする
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 bg-stone-100">
          <TabsTrigger value="all" className="text-xs">
            すべて
          </TabsTrigger>
          <TabsTrigger value="transaction" className="text-xs">
            取引
          </TabsTrigger>
          <TabsTrigger value="eco_impact" className="text-xs">
            環境
          </TabsTrigger>
          <TabsTrigger value="campaign" className="text-xs">
            特典
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs">
            その他
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="divide-y divide-stone-100">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-stone-50 transition-colors ${
                    !notification.isRead ? "bg-teal-50/30" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.type === "transaction"
                        ? "bg-blue-50"
                        : notification.type === "eco_impact"
                          ? "bg-teal-50"
                          : notification.type === "campaign"
                            ? "bg-amber-50"
                            : notification.type === "security"
                              ? "bg-red-50"
                              : "bg-stone-50"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-stone-800">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-stone-500 whitespace-nowrap ml-2">
                        {notification.date.split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>

                    {!notification.isRead && (
                      <div className="mt-1.5 flex justify-end">
                        <div className="h-2 w-2 rounded-full bg-teal-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-stone-400" />
                </div>
                <p className="text-sm text-stone-600">通知はありません</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        <Link href="/settings?tab=notifications">
          <Button
            variant="outline"
            className="w-full text-sm border-stone-200 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              通知設定を変更する
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
