import { StateCreator } from "zustand";
import { create } from "zustand";
import { Campaign } from "../types/campaign";
import { campaignsData } from "../data/campaigns-data";
import {
  findCampaignById,
  filterActiveCampaigns,
  filterPopularCampaigns,
  filterCampaignsByType,
} from "../utils/campaign-utils";

/**
 * Campaign スライスの型定義
 */
export interface CampaignSlice {
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

/**
 * Campaign スライスの作成関数
 */
export const createCampaignSlice: StateCreator<
  CampaignSlice,
  [],
  [],
  CampaignSlice
> = (set, get) => ({
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
});

/**
 * 単独で使用可能な Campaign ストアフック
 */
export const useCampaignStore = create<CampaignSlice>()((...a) => ({
  ...createCampaignSlice(...a),
}));
