import { create } from "zustand";
import { ecoImpactData } from "@/lib/mock-data/eco-impact";
import {
  calculateAverageProgress,
  determineEcoRank,
  EcoRank,
} from "@/lib/utils/eco-impact";
import { calculateEcoImpact } from "@/lib/utils/transaction";

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
      const impact = calculateEcoImpact(amount);

      const newForestArea =
        state.forestArea + (forestArea || impact.forestArea);
      const newWaterSaved =
        state.waterSaved + (waterSaved || impact.waterSaved);
      const newCo2Reduction =
        state.co2Reduction + (co2Reduction || impact.co2Reduction);

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
      // 指標の配列を作成
      const indicators = [
        { current: state.forestArea, target: state.targetForestArea },
        { current: state.waterSaved, target: state.targetWaterSaved },
        { current: state.co2Reduction, target: state.targetCo2Reduction },
      ];

      const progress = calculateAverageProgress(indicators);

      return { progressPercent: progress };
    }),

  getEcoRank: () => {
    const totalDonation = get().totalDonation;
    return determineEcoRank(totalDonation);
  },
}));
