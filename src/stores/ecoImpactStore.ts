import { create } from "zustand";
import { ecoImpactData } from "@/lib/mock-data/eco-impact";

export type EcoRank =
  | "エコビギナー"
  | "エコサポーター"
  | "エコマイスター"
  | "エコチャンピオン";

interface EcoImpactState {
  // 環境貢献データ
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
  progressPercent: number;
  totalDonation: number;
  monthlyDonation: number;
  ecoRank: EcoRank;

  // 目標値
  targetForestArea: number;
  targetWaterSaved: number;
  targetCo2Reduction: number;

  // アクション
  addContribution: (params: {
    amount: number;
    forestArea?: number;
    waterSaved?: number;
    co2Reduction?: number;
  }) => void;
  updateProgress: () => void;
  getEcoRank: () => EcoRank;
}

export const useEcoImpactStore = create<EcoImpactState>((set, get) => ({
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
  ecoRank: "エコマイスター", // デフォルトランク

  // 環境貢献を追加
  addContribution: ({
    amount,
    forestArea = 0,
    waterSaved = 0,
    co2Reduction = 0,
  }) =>
    set((state) => {
      // 環境貢献の計算（具体的な数値がなければ金額に応じて概算）
      const newForestArea = state.forestArea + (forestArea || amount * 0.0005); // 1000円で約0.5㎡
      const newWaterSaved = state.waterSaved + (waterSaved || amount * 0.25); // 1000円で約250L
      const newCo2Reduction =
        state.co2Reduction + (co2Reduction || amount * 0.0125); // 1000円で約12.5kg

      // 寄付総額の更新
      const newTotalDonation = state.totalDonation + amount;
      const newMonthlyDonation = state.monthlyDonation + amount;

      return {
        forestArea: newForestArea,
        waterSaved: newWaterSaved,
        co2Reduction: newCo2Reduction,
        totalDonation: newTotalDonation,
        monthlyDonation: newMonthlyDonation,
      };
    }),

  // 進捗率の更新
  updateProgress: () =>
    set((state) => {
      // 各目標に対する進捗を計算
      const forestProgress = (state.forestArea / state.targetForestArea) * 100;
      const waterProgress = (state.waterSaved / state.targetWaterSaved) * 100;
      const co2Progress = (state.co2Reduction / state.targetCo2Reduction) * 100;

      // 平均進捗率を計算
      const averageProgress =
        (forestProgress + waterProgress + co2Progress) / 3;

      return {
        progressPercent: Math.min(100, Math.round(averageProgress)),
      };
    }),

  // エコランクの取得（寄付総額に基づく）
  getEcoRank: () => {
    const totalDonation = get().totalDonation;

    if (totalDonation >= 50000) return "エコチャンピオン";
    if (totalDonation >= 20000) return "エコマイスター";
    if (totalDonation >= 5000) return "エコサポーター";
    return "エコビギナー";
  },
}));
