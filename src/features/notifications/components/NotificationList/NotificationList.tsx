"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationItem } from "../NotificationItem";
import { Notification } from "../../types/notification";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onNotificationsUpdate: (notifications: Notification[]) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationClick,
  onNotificationsUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // フィルタリングされた通知の取得
  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications;
    }
    return notifications.filter((n) => n.type === activeTab);
  };

  const handleNotificationClick = (notification: Notification) => {
    // 未読を既読に変更
    if (!notification.isRead) {
      const updatedNotifications = notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n,
      );
      onNotificationsUpdate(updatedNotifications);
    }
    onNotificationClick(notification);
  };

  const filteredNotifications = getFilteredNotifications();

  return (
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
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
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
  );
};
