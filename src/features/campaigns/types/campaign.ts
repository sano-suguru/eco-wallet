/**
 * キャンペーン機能の型定義
 */

/**
 * キャンペーンタイプの型
 */
export type CampaignType = "eco" | "point" | "event" | "referral";

/**
 * キャンペーン情報の型定義
 */
export interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  imageType?: string;
  pointRate?: number; // ポイント還元率（例: 20は20%を意味する）
  conditions: string[];
  benefitDescription: string;
  steps?: string[];
  relatedItems?: {
    title: string;
    description: string;
    imageType?: string;
  }[];
  ecoImpact?: {
    title: string;
    description: string;
    metrics?: Array<{
      label: string;
      value: string;
      icon: string;
    }>;
  };
  isActive: boolean;
  isPopular?: boolean;
  badgeText?: string;
}
