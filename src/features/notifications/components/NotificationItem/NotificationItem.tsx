import React from "react";
import {
  Bell,
  Leaf,
  ShoppingBag,
  Megaphone,
  AlertTriangle,
} from "lucide-react";
import {
  Notification,
  NotificationType,
  notificationIcons,
} from "../../types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
}) => {
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

  const iconConfig = notificationIcons[notification.type];

  return (
    <div
      className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-stone-50 transition-colors ${
        !notification.isRead ? "bg-teal-50/30" : ""
      }`}
      onClick={() => onClick(notification)}
    >
      <div
        className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center ${iconConfig.bgColor}`}
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
  );
};
