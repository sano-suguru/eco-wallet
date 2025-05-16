import { create } from "zustand";
import { Campaign, campaignsData } from "@/lib/mock-data/campaigns";
import {
  findCampaignById,
  filterActiveCampaigns,
  filterPopularCampaigns,
  filterCampaignsByType,
} from "@/lib/utils/campaign-utils";

interface CampaignState {
  // データ
  campaigns: Campaign[];

  // アクション
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;

  // クエリ
  getCampaignById: (id: string) => Campaign | undefined;
  getActiveCampaigns: () => Campaign[];
  getPopularCampaigns: () => Campaign[];
  getCampaignsByType: (type: string) => Campaign[];
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  // 初期状態
  campaigns: campaignsData,

  // アクション
  setCampaigns: (campaigns) => set({ campaigns }),

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    })),

  // クエリ - ユーティリティ関数を使用
  getCampaignById: (id) => {
    return findCampaignById(get().campaigns, id);
  },

  getActiveCampaigns: () => {
    return filterActiveCampaigns(get().campaigns);
  },

  getPopularCampaigns: () => {
    return filterPopularCampaigns(get().campaigns);
  },

  getCampaignsByType: (type) => {
    return filterCampaignsByType(get().campaigns, type);
  },
}));
