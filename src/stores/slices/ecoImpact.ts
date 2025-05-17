import { StateCreator } from "zustand";
import { create } from "zustand";
import { ecoImpactData } from "@/lib/mock-data/eco-impact";
import {
  EcoRank,
  ContributionParams,
  calculateContribution,
  calculateEcoProgress,
  getEcoRankFromDonation,
} from "@/lib/utils/eco";

/**
 * EcoImpact スライスの型定義
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

  // アクション
  addContribution: (params: ContributionParams) => void;
  updateProgress: () => void;

  // 派生データ
  getEcoRank: () => EcoRank;
}

/**
 * EcoImpact スライスの作成関数
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

  // 環境貢献を追加 - ユーティリティ関数を使用
  addContribution: (params) =>
    set((state) => {
      return calculateContribution(state, params);
    }),

  // 進捗率の更新 - ユーティリティ関数を使用
  updateProgress: () =>
    set((state) => {
      const progress = calculateEcoProgress(
        state.forestArea,
        state.waterSaved,
        state.co2Reduction,
        state.targetForestArea,
        state.targetWaterSaved,
        state.targetCo2Reduction,
      );

      return { progressPercent: progress };
    }),

  // エコランクの取得 - ユーティリティ関数を使用
  getEcoRank: () => {
    return getEcoRankFromDonation(get().totalDonation);
  },
});

/**
 * 単独で使用可能な EcoImpact ストアフック
 */
export const useEcoImpactStore = create<EcoImpactSlice>()((...a) => ({
  ...createEcoImpactSlice(...a),
}));
