export type NotificationType =
  | "transaction"
  | "eco_impact"
  | "campaign"
  | "system"
  | "security";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
  imageType?: string;
}

// 通知アイコンの型定義
export interface NotificationIcon {
  className: string;
  bgColor: string;
}

// 通知タイプごとのアイコン設定
export const notificationIcons: Record<NotificationType, NotificationIcon> = {
  transaction: {
    className: "h-5 w-5 text-blue-500",
    bgColor: "bg-blue-50",
  },
  eco_impact: {
    className: "h-5 w-5 text-teal-600",
    bgColor: "bg-teal-50",
  },
  campaign: {
    className: "h-5 w-5 text-amber-500",
    bgColor: "bg-amber-50",
  },
  security: {
    className: "h-5 w-5 text-red-500",
    bgColor: "bg-red-50",
  },
  system: {
    className: "h-5 w-5 text-stone-500",
    bgColor: "bg-stone-50",
  },
};
