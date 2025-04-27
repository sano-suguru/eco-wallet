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

export const notificationsData: Notification[] = [
  {
    id: "notif_1",
    type: "transaction",
    title: "決済完了",
    message:
      "エコ製品定期プラン（¥4,000）の支払いが完了しました。環境貢献: ¥200",
    date: "2025/04/19 12:30",
    isRead: true,
    link: "/history",
  },
  {
    id: "notif_2",
    type: "eco_impact",
    title: "環境目標達成！",
    message:
      "おめでとうございます！森林保全の目標の50%を達成しました。あと5m²で目標達成です。",
    date: "2025/04/18 14:15",
    isRead: false,
    link: "/impact",
    imageType: "forest",
  },
  {
    id: "notif_3",
    type: "campaign",
    title: "新キャンペーン",
    message:
      "山の日キャンペーンが開始されました。エコ製品購入で20%のポイント還元があります。",
    date: "2025/04/18 09:00",
    isRead: false,
  },
  {
    id: "notif_4",
    type: "system",
    title: "アプリアップデート",
    message:
      "Eco Walletアプリがバージョン2.0にアップデートされました。新機能をご確認ください。",
    date: "2025/04/15 17:45",
    isRead: true,
  },
  {
    id: "notif_5",
    type: "security",
    title: "ログイン確認",
    message:
      "新しいデバイスからログインがありました。心当たりがない場合は設定から確認してください。",
    date: "2025/04/12 08:23",
    isRead: true,
    link: "/settings?tab=security",
  },
  {
    id: "notif_6",
    type: "eco_impact",
    title: "環境貢献レポート",
    message: "3月の環境貢献レポートが発行されました。CO2排出削減: 18kg達成！",
    date: "2025/04/01 10:00",
    isRead: true,
    link: "/impact",
  },
];
