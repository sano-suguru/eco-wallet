/**
 * 残高情報を管理するストア（Result型対応）
 */

import { create } from "zustand";
import { Result, ResultAsync, ok, err } from "neverthrow";
import { CampaignBalance } from "../types/balance";
import { BusinessError, AppError } from "../../../shared/types/errors";
import { fetchBalance } from "../../../services/api/balance";
import {
  calculateTotalBalance,
  validateChargeAmount,
  processCharge,
} from "../../../lib/business/balance";

/**
 * 残高ストアの状態型（Result型対応）
 */
export interface BalanceState {
  /** 通常残高 */
  regularBalance: number;

  /** キャンペーン残高のリスト */
  campaignBalances: Array<CampaignBalance & { daysLeft: number }>;

  /** ローディング状態 */
  isLoading: boolean;

  /** エラー状態 */
  error: AppError | null;

  /** 合計残高を取得（Result型対応） */
  getTotalBalance: () => Result<number, BusinessError>;

  /** 残高を更新 */
  updateBalance: (newRegularBalance: number) => void;

  /** 通常残高から引く */
  subtractFromRegularBalance: (amount: number) => void;

  /** キャンペーン残高を追加 */
  addCampaignBalance: (
    campaign: CampaignBalance,
  ) => Result<void, BusinessError>;

  /** キャンペーン残高を更新 */
  updateCampaignBalance: (
    campaignId: string,
    amount: number,
  ) => Result<void, BusinessError>;

  /** 残高を非同期で取得（API統合） */
  fetchBalanceAsync: (userId?: string) => ResultAsync<void, AppError>;

  /** チャージ処理（API統合） */
  processChargeAsync: (
    amount: number,
    paymentMethodId:
      | "bank_transfer"
      | "credit_card"
      | "convenience_store"
      | "atm",
  ) => ResultAsync<void, AppError>;

  /** エラーをクリア */
  clearError: () => void;

  /** ローディング状態を設定 */
  setLoading: (loading: boolean) => void;
}

/**
 * 残高ストア（Result型対応）
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
  isLoading: false,
  error: null,

  // 合計残高を計算（Result型対応）
  getTotalBalance: () => {
    const { regularBalance, campaignBalances } = get();

    // ビジネスロジック関数を使用
    const balanceData = campaignBalances.map((cb) => ({
      id: cb.campaignId === "ref-10-2023" ? 1 : 2,
      amount: cb.amount,
      label: cb.campaignName,
      expiryDate: cb.expiryDate,
      daysLeft: cb.daysLeft,
    }));

    const result = calculateTotalBalance(regularBalance, balanceData);
    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.totalBalance);
  },

  // 通常残高を更新
  updateBalance: (newRegularBalance) => {
    set({ regularBalance: newRegularBalance, error: null });
  },

  // 通常残高から引く
  subtractFromRegularBalance: (amount) => {
    set((state) => ({
      regularBalance: Math.max(0, state.regularBalance - amount),
      error: null,
    }));
  },

  // キャンペーン残高を追加（Result型対応）
  addCampaignBalance: (campaign) => {
    try {
      if (!campaign.campaignId || campaign.amount < 0) {
        return err({
          type: "PAYMENT_FAILED",
          message: "無効なキャンペーン残高です",
          reason: `campaignId: ${campaign.campaignId}, amount: ${campaign.amount}`,
          paymentId: undefined,
        });
      }

      set((state) => ({
        campaignBalances: [
          ...state.campaignBalances,
          {
            ...campaign,
            daysLeft: campaign.daysRemaining,
          },
        ],
        error: null,
      }));

      return ok(undefined);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "キャンペーン残高の追加に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // キャンペーン残高を更新（Result型対応）
  updateCampaignBalance: (campaignId, amount) => {
    try {
      if (!campaignId || amount < 0) {
        return err({
          type: "PAYMENT_FAILED",
          message: "無効なキャンペーン残高更新です",
          reason: `campaignId: ${campaignId}, amount: ${amount}`,
          paymentId: undefined,
        });
      }

      const { campaignBalances } = get();
      const campaign = campaignBalances.find(
        (cb) => cb.campaignId === campaignId,
      );

      if (!campaign) {
        return err({
          type: "PAYMENT_FAILED",
          message: "キャンペーンが見つかりません",
          reason: `campaignId: ${campaignId}`,
          paymentId: undefined,
        });
      }

      set((state) => ({
        campaignBalances: state.campaignBalances.map((campaign) =>
          campaign.campaignId === campaignId
            ? { ...campaign, amount }
            : campaign,
        ),
        error: null,
      }));

      return ok(undefined);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "キャンペーン残高の更新に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // 残高を非同期で取得（API統合）
  fetchBalanceAsync: (userId?: string) => {
    return ResultAsync.fromSafePromise(
      (async () => {
        set({ isLoading: true, error: null });

        const balanceResult = await fetchBalance(userId);

        if (balanceResult.isErr()) {
          const error: AppError = balanceResult.error;
          set({ isLoading: false, error });
          throw error;
        }

        const balanceData = balanceResult.value;
        set({
          regularBalance: balanceData.currentBalance,
          isLoading: false,
          error: null,
        });
      })(),
    ).mapErr((error: unknown): AppError => {
      const appError: AppError =
        error && typeof error === "object" && "type" in error
          ? (error as AppError)
          : { type: "NETWORK_ERROR", message: String(error) };

      set({ isLoading: false, error: appError });
      return appError;
    });
  },

  // チャージ処理（API統合）
  processChargeAsync: (
    amount: number,
    paymentMethodId:
      | "bank_transfer"
      | "credit_card"
      | "convenience_store"
      | "atm",
  ) => {
    return ResultAsync.fromSafePromise(
      (async () => {
        set({ isLoading: true, error: null });

        // バリデーション
        const amountValidation = validateChargeAmount(amount);
        if (amountValidation.isErr()) {
          const error: AppError = amountValidation.error;
          set({ isLoading: false, error });
          throw error;
        }

        // チャージ処理
        const chargeResult = await processCharge({
          amount,
          paymentMethod: paymentMethodId,
          description: "チャージ",
        });

        if (chargeResult.isErr()) {
          const error: AppError = chargeResult.error;
          set({ isLoading: false, error });
          throw error;
        }

        // 残高を更新
        set((state) => ({
          regularBalance: state.regularBalance + amount,
          isLoading: false,
          error: null,
        }));
      })(),
    ).mapErr((error: unknown): AppError => {
      const appError: AppError =
        error && typeof error === "object" && "type" in error
          ? (error as AppError)
          : { type: "NETWORK_ERROR", message: String(error) };

      set({ isLoading: false, error: appError });
      return appError;
    });
  },

  // エラーをクリア
  clearError: () => {
    set({ error: null });
  },

  // ローディング状態を設定
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
