import { StateCreator } from "zustand";
import { create } from "zustand";
import { Result, ok, err } from "neverthrow";
import { ecoImpactData } from "../data/eco-impact-data";
import { EcoRank, ContributionParams } from "../types/eco-impact";
import { BusinessError, AppError } from "../../../shared/types/errors";
import {
  calculateContribution,
  calculateEcoProgress,
  getEcoRankFromDonation,
} from "../utils/calculations";

/**
 * EcoImpact スライスの型定義（Result型対応）
 */
export interface EcoImpactSlice {
  // 環境貢献データ
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
  progressPercent: number;
  totalDonation: number;
  monthlyDonation: number;

  // 目標値
  targetForestArea: number;
  targetWaterSaved: number;
  targetCo2Reduction: number;

  // エラー状態
  error: AppError | null;

  // アクション（Result型対応）
  addContribution: (params: ContributionParams) => Result<void, BusinessError>;
  updateProgress: () => Result<number, BusinessError>;

  // 派生データ（Result型対応）
  getEcoRank: () => Result<EcoRank, BusinessError>;

  // ユーティリティ
  clearError: () => void;
}

/**
 * EcoImpact スライスの作成関数（Result型対応）
 */
export const createEcoImpactSlice: StateCreator<
  EcoImpactSlice,
  [],
  [],
  EcoImpactSlice
> = (set, get) => ({
  // 初期状態（モックデータから）
  forestArea: ecoImpactData.forestArea,
  waterSaved: ecoImpactData.waterSaved,
  co2Reduction: ecoImpactData.co2Reduction,
  progressPercent: ecoImpactData.progressPercent,
  targetForestArea: ecoImpactData.targetForestArea,
  targetWaterSaved: ecoImpactData.targetWaterSaved,
  targetCo2Reduction: ecoImpactData.targetCo2Reduction,
  totalDonation: ecoImpactData.totalDonation,
  monthlyDonation: ecoImpactData.monthlyDonation,
  error: null,

  // 環境貢献を追加（Result型対応）
  addContribution: (params) => {
    try {
      // パラメータバリデーション
      if (!params || params.amount <= 0) {
        return err({
          type: "PAYMENT_FAILED",
          message: "無効な環境貢献パラメータです",
          reason: `amount: ${params?.amount}`,
          paymentId: undefined,
        });
      }

      set((state) => {
        const newState = calculateContribution(state, params);
        return { ...newState, error: null };
      });

      return ok(undefined);
    } catch (error) {
      const errorResult: BusinessError = {
        type: "PAYMENT_FAILED",
        message: "環境貢献の追加に失敗しました",
        reason: String(error),
        paymentId: undefined,
      };

      set({ error: errorResult });
      return err(errorResult);
    }
  },

  // 進捗率の更新（Result型対応）
  updateProgress: () => {
    try {
      const state = get();
      const progress = calculateEcoProgress(
        state.forestArea,
        state.waterSaved,
        state.co2Reduction,
        state.targetForestArea,
        state.targetWaterSaved,
        state.targetCo2Reduction,
      );

      // 進捗率の妥当性チェック
      if (progress < 0 || progress > 100) {
        return err({
          type: "PAYMENT_FAILED",
          message: "進捗率の計算結果が無効です",
          reason: `progress: ${progress}`,
          paymentId: undefined,
        });
      }

      set({ progressPercent: progress, error: null });
      return ok(progress);
    } catch (error) {
      const errorResult: BusinessError = {
        type: "PAYMENT_FAILED",
        message: "進捗率の更新に失敗しました",
        reason: String(error),
        paymentId: undefined,
      };

      set({ error: errorResult });
      return err(errorResult);
    }
  },

  // エコランクの取得（Result型対応）
  getEcoRank: () => {
    try {
      const totalDonation = get().totalDonation;

      if (totalDonation < 0) {
        return err({
          type: "PAYMENT_FAILED",
          message: "寄付総額が無効です",
          reason: `totalDonation: ${totalDonation}`,
          paymentId: undefined,
        });
      }

      const rank = getEcoRankFromDonation(totalDonation);
      return ok(rank);
    } catch (error) {
      return err({
        type: "PAYMENT_FAILED",
        message: "エコランクの取得に失敗しました",
        reason: String(error),
        paymentId: undefined,
      });
    }
  },

  // エラーをクリア
  clearError: () => {
    set({ error: null });
  },
});

/**
 * 単独で使用可能な EcoImpact ストアフック
 */
export const useEcoImpactStore = create<EcoImpactSlice>()((...a) => ({
  ...createEcoImpactSlice(...a),
}));
