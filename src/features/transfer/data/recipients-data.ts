import { Recipient, SplitHistory } from "../types/transfer";

// 受取人のモックデータ
export const recentRecipients: Recipient[] = [
  {
    id: "rec1",
    name: "田中",
    avatar: "/api/placeholder/32/32",
    color: "blue",
    isEcoUser: true,
  },
  {
    id: "rec2",
    name: "佐藤",
    avatar: "/api/placeholder/32/32",
    color: "green",
    isEcoUser: true,
  },
  {
    id: "rec3",
    name: "鈴木",
    avatar: "/api/placeholder/32/32",
    color: "purple",
    isEcoUser: false,
  },
  {
    id: "rec4",
    name: "高橋",
    avatar: "/api/placeholder/32/32",
    color: "amber",
    isEcoUser: true,
  },
];

// 過去の割り勘履歴のモックデータ
export const splitHistories: SplitHistory[] = [
  {
    id: "split-camp-123",
    title: "キャンプ用品費用",
    date: "2025/04/10",
    participantCount: 3,
    amount: 18600,
    status: "completed",
  },
  {
    id: "split-fuji-456",
    title: "富士山登山費用",
    date: "2025/03/15",
    participantCount: 4,
    amount: 24000,
    status: "pending",
  },
];

// デフォルトの参加者データ
export const defaultParticipants = [
  {
    id: "self",
    name: "あなた（山田太郎）",
    isPayor: true,
    amount: "",
    email: "",
  },
  {
    id: "p1",
    name: "田中 花子",
    isEcoUser: true,
    amount: "",
    email: "tanaka@example.com",
  },
  {
    id: "p2",
    name: "佐藤 健太",
    isEcoUser: false,
    amount: "",
    email: "",
  },
];
