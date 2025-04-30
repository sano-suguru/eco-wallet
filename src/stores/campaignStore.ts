import { create } from "zustand";
import { Campaign, campaignsData } from "@/lib/mock-data/campaigns";

interface CampaignState {
  // キャンペーンデータ
  campaigns: Campaign[];

  // アクション
  getCampaignById: (id: string) => Campaign | undefined;
  getActiveCampaigns: () => Campaign[];
  getPopularCampaigns: () => Campaign[];
  getCampaignsByType: (type: string) => Campaign[];
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  // 初期状態
  campaigns: campaignsData,

  // IDでキャンペーンを検索
  getCampaignById: (id) => {
    return get().campaigns.find((campaign) => campaign.id === id);
  },

  // アクティブなキャンペーンを取得
  getActiveCampaigns: () => {
    return get().campaigns.filter((campaign) => campaign.isActive);
  },

  // 人気のキャンペーンを取得
  getPopularCampaigns: () => {
    return get().campaigns.filter((campaign) => campaign.isPopular);
  },

  // タイプでキャンペーンをフィルタリング
  getCampaignsByType: (type) => {
    return get().campaigns.filter((campaign) => campaign.type === type);
  },
}));
