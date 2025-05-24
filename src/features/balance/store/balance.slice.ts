/**
 * 残高情報を管理するストア
 */

import { create } from "zustand";
import { CampaignBalance } from "../types/balance";

/**
 * 残高ストアの状態型
 */
export interface BalanceState {
  /** 通常残高 */
  regularBalance: number;

  /** キャンペーン残高のリスト */
  campaignBalances: Array<CampaignBalance & { daysLeft: number }>;

  /** 合計残高を取得 */
  getTotalBalance: () => number;

  /** 残高を更新 */
  updateBalance: (newRegularBalance: number) => void;

  /** 通常残高から引く */
  subtractFromRegularBalance: (amount: number) => void;

  /** キャンペーン残高を追加 */
  addCampaignBalance: (campaign: CampaignBalance) => void;

  /** キャンペーン残高を更新 */
  updateCampaignBalance: (campaignId: string, amount: number) => void;
}

/**
 * 残高ストア
 */
export const useBalanceStore = create<BalanceState>((set, get) => ({
  // 初期値
  regularBalance: 15000,
  campaignBalances: [
    {
      campaignId: "ref-10-2023",
      campaignName: "紹介特典",
      amount: 1000,
      expiryDate: "2023-12-31",
      daysRemaining: 30,
      daysLeft: 30,
    },
    {
      campaignId: "eco-5-2023",
      campaignName: "エコ活動ボーナス",
      amount: 500,
      expiryDate: "2023-11-15",
      daysRemaining: 5,
      daysLeft: 5,
    },
  ],

  // 合計残高を計算
  getTotalBalance: () => {
    const { regularBalance, campaignBalances } = get();
    const campaignTotal = campaignBalances.reduce(
      (sum, campaign) => sum + campaign.amount,
      0,
    );
    return regularBalance + campaignTotal;
  },

  // 通常残高を更新
  updateBalance: (newRegularBalance) => {
    set({ regularBalance: newRegularBalance });
  },

  // 通常残高から引く
  subtractFromRegularBalance: (amount) => {
    set((state) => ({ regularBalance: state.regularBalance - amount }));
  },

  // キャンペーン残高を追加
  addCampaignBalance: (campaign) => {
    set((state) => ({
      campaignBalances: [
        ...state.campaignBalances,
        {
          ...campaign,
          daysLeft: campaign.daysRemaining,
        },
      ],
    }));
  },

  // キャンペーン残高を更新
  updateCampaignBalance: (campaignId, amount) => {
    set((state) => ({
      campaignBalances: state.campaignBalances.map((campaign) =>
        campaign.campaignId === campaignId ? { ...campaign, amount } : campaign,
      ),
    }));
  },
}));
