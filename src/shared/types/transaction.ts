/**
 * 取引タイプの型定義
 */
export type TransactionType =
  | "payment"
  | "charge"
  | "receive"
  | "donation"
  | "expired";

/**
 * 環境貢献情報の型定義
 */
export interface EcoContribution {
  enabled: boolean;
  amount: number;
  project?: string; // 環境貢献プロジェクト名
}

/**
 * キャンペーン情報の型定義
 */
export interface CampaignInfo {
  name: string; // キャンペーン名
  expiryDate?: string; // 有効期限
  expiredDate?: string; // 期限切れ日
}

/**
 * 割り勘情報の型定義
 */
export interface SplitInfo {
  participants: number; // 参加者数
  collected: number; // 回収済み人数
  remaining: number; // 残り人数
}

/**
 * 取引情報の型定義
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  amount: number;
  ecoContribution?: EcoContribution;
  badges?: string[];
  campaignInfo?: CampaignInfo;
  splitInfo?: SplitInfo;
}
