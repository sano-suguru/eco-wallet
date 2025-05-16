import { create } from "zustand";
import { userBalanceData } from "@/lib/mock-data/user-profile";
import {
  CampaignBalance,
  calculateTotalBalance,
} from "@/lib/utils/balance-utils";

interface BalanceState {
  // 基本残高情報
  regularBalance: number;
  campaignBalances: CampaignBalance[];

  // アクション
  addToRegularBalance: (amount: number) => void;
  subtractFromRegularBalance: (amount: number) => void;
  setCampaignBalances: (campaignBalances: CampaignBalance[]) => void;
  addCampaignBalance: (campaignBalance: Omit<CampaignBalance, "id">) => void;
  subtractFromCampaignBalance: (id: number, amount: number) => void;

  // 派生データ
  getTotalBalance: () => number;
}

// 初期キャンペーン残高データ
const initialCampaignBalances: CampaignBalance[] = [
  {
    id: 1,
    amount: 2000,
    label: "山の日キャンペーン",
    expiryDate: "2025/05/11",
    daysLeft: 21,
    conditions: "環境に配慮した商品の購入のみ有効",
  },
  {
    id: 2,
    amount: 500,
    label: "友達紹介ボーナス",
    expiryDate: "2025/04/30",
    daysLeft: 10,
    conditions: "制限なし",
  },
];

export const useBalanceStore = create<BalanceState>((set, get) => ({
  // 初期状態
  regularBalance: userBalanceData.balance
    ? userBalanceData.balance - 2500
    : 6000, // キャンペーン残高を除いた通常残高
  campaignBalances: initialCampaignBalances,

  // アクション
  addToRegularBalance: (amount) =>
    set((state) => ({
      regularBalance: state.regularBalance + amount,
    })),

  subtractFromRegularBalance: (amount) =>
    set((state) => ({
      regularBalance: Math.max(0, state.regularBalance - amount),
    })),

  setCampaignBalances: (campaignBalances) => set({ campaignBalances }),

  addCampaignBalance: (campaignBalance) =>
    set((state) => {
      const newId =
        Math.max(0, ...state.campaignBalances.map((cb) => cb.id)) + 1;
      const newCampaignBalance = { id: newId, ...campaignBalance };

      return {
        campaignBalances: [...state.campaignBalances, newCampaignBalance],
      };
    }),

  subtractFromCampaignBalance: (id, amount) =>
    set((state) => {
      const updatedCampaignBalances = state.campaignBalances.map((cb) => {
        if (cb.id === id) {
          const newAmount = Math.max(0, cb.amount - amount);
          return { ...cb, amount: newAmount };
        }
        return cb;
      });

      return {
        campaignBalances: updatedCampaignBalances,
      };
    }),

  // 派生データ - ユーティリティ関数を使用
  getTotalBalance: () => {
    return calculateTotalBalance(get().regularBalance, get().campaignBalances);
  },
}));
