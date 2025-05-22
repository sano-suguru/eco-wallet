/**
 * キャンペーン関連のユーティリティ関数
 */
import { Campaign } from "../types/campaign";

/**
 * IDでキャンペーンを検索する
 */
export const findCampaignById = (
  campaigns: Campaign[],
  id: string,
): Campaign | undefined => {
  return campaigns.find((campaign) => campaign.id === id);
};

/**
 * アクティブなキャンペーンをフィルタリングする
 */
export const filterActiveCampaigns = (campaigns: Campaign[]): Campaign[] => {
  return campaigns.filter((campaign) => campaign.isActive);
};

/**
 * 人気のキャンペーンをフィルタリングする
 */
export const filterPopularCampaigns = (campaigns: Campaign[]): Campaign[] => {
  return campaigns.filter((campaign) => campaign.isPopular);
};

/**
 * タイプでキャンペーンをフィルタリングする
 */
export const filterCampaignsByType = (
  campaigns: Campaign[],
  type: string,
): Campaign[] => {
  return campaigns.filter((campaign) => campaign.type === type);
};
