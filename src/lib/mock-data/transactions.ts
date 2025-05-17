export type TransactionType =
  | "payment"
  | "charge"
  | "receive"
  | "donation"
  | "expired";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  amount: number;
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
  badges?: string[];
}

export const transactionsData: Transaction[] = [
  {
    id: "split-camp-123",
    type: "payment",
    description: "キャンプ用品費用（立替）",
    date: "2025/04/10",
    amount: -18600,
    ecoContribution: {
      enabled: true,
      amount: 186,
    },
    badges: ["割り勘", "完了"],
  },
  {
    id: "split-fuji-456",
    type: "payment",
    description: "富士山登山費用（立替）",
    date: "2025/03/15",
    amount: -24000,
    ecoContribution: {
      enabled: true,
      amount: 240,
    },
    badges: ["割り勘", "進行中"],
  },
  {
    id: "txn_1",
    type: "payment",
    description: "エコ製品定期プラン",
    date: "2025/04/19",
    amount: -4000,
    ecoContribution: {
      enabled: true,
      amount: 200,
    },
  },
  {
    id: "txn_2",
    type: "charge",
    description: "Eco Walletチャージ",
    date: "2025/04/15",
    amount: 10000,
  },
  {
    id: "txn_3",
    type: "payment",
    description: "オーガニックコットンTシャツ",
    date: "2025/04/10",
    amount: -3200,
    ecoContribution: {
      enabled: true,
      amount: 150,
    },
    badges: ["環境貢献"],
  },
  {
    id: "txn_4",
    type: "payment",
    description: "リサイクルフリース",
    date: "2025/04/05",
    amount: -12000,
    ecoContribution: {
      enabled: true,
      amount: 500,
    },
    badges: ["環境貢献"],
  },
  {
    id: "txn_5",
    type: "receive",
    description: "友達紹介ボーナス",
    date: "2025/04/03",
    amount: 1000,
    badges: ["特典"],
  },
  {
    id: "txn_6",
    type: "expired",
    description: "エコポイント期限切れ",
    date: "2025/04/02",
    amount: -500,
    badges: ["期限切れ"],
  },
  {
    id: "txn_7",
    type: "charge",
    description: "Eco Walletチャージ",
    date: "2025/04/01",
    amount: 20000,
  },
];
