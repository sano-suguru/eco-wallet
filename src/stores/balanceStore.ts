import { create } from "zustand";
import { userBalanceData } from "@/lib/mock-data/user-profile";

interface BalanceState {
  // 基本残高情報
  balance: number;
  regularBalance: number;
  campaignBalances: Array<{
    id: number;
    amount: number;
    label: string;
    expiryDate: string;
    daysLeft: number;
    conditions?: string;
  }>;

  // アクション
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => void;
  setCampaignBalances: (
    campaignBalances: BalanceState["campaignBalances"],
  ) => void;
  addCampaignBalance: (
    campaignBalance: Omit<BalanceState["campaignBalances"][0], "id">,
  ) => void;
  subtractFromRegularBalance: (amount: number) => void;
  subtractFromCampaignBalance: (id: number, amount: number) => void;
  getTotalBalance: () => number;
}

// 初期キャンペーン残高データ
const initialCampaignBalances = [
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
  balance: userBalanceData.balance || 8500,
  regularBalance: 6000, // 通常残高の初期値
  campaignBalances: initialCampaignBalances,

  // アクション
  addBalance: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
      regularBalance: state.regularBalance + amount,
    })),

  subtractBalance: (amount) =>
    set((state) => ({
      balance: state.balance - amount,
    })),

  setCampaignBalances: (campaignBalances) => set({ campaignBalances }),

  addCampaignBalance: (campaignBalance) =>
    set((state) => {
      const newId =
        Math.max(0, ...state.campaignBalances.map((cb) => cb.id)) + 1;
      const newCampaignBalance = { id: newId, ...campaignBalance };
      const newBalance = state.balance + campaignBalance.amount;

      return {
        campaignBalances: [...state.campaignBalances, newCampaignBalance],
        balance: newBalance,
      };
    }),

  subtractFromRegularBalance: (amount) =>
    set((state) => {
      const newRegularBalance = Math.max(0, state.regularBalance - amount);
      const deducted = state.regularBalance - newRegularBalance;

      return {
        regularBalance: newRegularBalance,
        balance: state.balance - deducted,
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

      // 実際に引かれた金額を計算
      const oldTotal = state.campaignBalances.reduce(
        (sum, cb) => sum + cb.amount,
        0,
      );
      const newTotal = updatedCampaignBalances.reduce(
        (sum, cb) => sum + cb.amount,
        0,
      );
      const deducted = oldTotal - newTotal;

      return {
        campaignBalances: updatedCampaignBalances,
        balance: state.balance - deducted,
      };
    }),

  getTotalBalance: () => {
    const regularBalance = get().regularBalance;
    const campaignTotal = get().campaignBalances.reduce(
      (sum, cb) => sum + cb.amount,
      0,
    );
    return regularBalance + campaignTotal;
  },
}));
