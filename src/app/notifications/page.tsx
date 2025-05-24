"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/features/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, ChevronRight } from "lucide-react";
import {
  NotificationList,
  useNotificationStore,
  type Notification,
} from "@/features/notifications";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    setNotifications,
    getUnreadCount,
  } = useNotificationStore();

  // 未読の通知数をカウント
  const unreadCount = getUnreadCount();

  // 通知をクリックしたときの処理
  const handleNotificationClick = (notification: Notification) => {
    // 未読を既読に変更
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // リンクがあればリダイレクト
    if (notification.link) {
      router.push(notification.link);
    } else {
      // 詳細ページがあれば詳細ページに遷移
      router.push(`/notifications/${notification.id}`);
    }
  };

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

      <NotificationList
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onNotificationsUpdate={setNotifications}
      />

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
