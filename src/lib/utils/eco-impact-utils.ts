/**
 * 環境貢献に関するユーティリティ関数
 */
import {
  EcoRank,
  calculateAverageProgress,
  determineEcoRank,
} from "@/lib/utils/eco-impact";
import { calculateEcoImpact } from "@/lib/utils/transaction";

/**
 * 環境指標の型定義
 */
export interface EcoIndicator {
  current: number;
  target: number;
}

/**
 * 貢献パラメータの型定義
 */
export interface ContributionParams {
  amount: number;
  forestArea?: number;
  waterSaved?: number;
  co2Reduction?: number;
}

/**
 * 貢献データを計算する
 */
export const calculateContribution = (
  state: {
    forestArea: number;
    waterSaved: number;
    co2Reduction: number;
    totalDonation: number;
    monthlyDonation: number;
  },
  params: ContributionParams,
) => {
  const impact = calculateEcoImpact(params.amount);

  const newForestArea =
    state.forestArea + (params.forestArea || impact.forestArea);
  const newWaterSaved =
    state.waterSaved + (params.waterSaved || impact.waterSaved);
  const newCo2Reduction =
    state.co2Reduction + (params.co2Reduction || impact.co2Reduction);

  // 寄付総額の更新
  const newTotalDonation = state.totalDonation + params.amount;
  const newMonthlyDonation = state.monthlyDonation + params.amount;

  return {
    forestArea: newForestArea,
    waterSaved: newWaterSaved,
    co2Reduction: newCo2Reduction,
    totalDonation: newTotalDonation,
    monthlyDonation: newMonthlyDonation,
  };
};

/**
 * 環境貢献の進捗を計算する
 */
export const calculateEcoProgress = (
  forestArea: number,
  waterSaved: number,
  co2Reduction: number,
  targetForestArea: number,
  targetWaterSaved: number,
  targetCo2Reduction: number,
): number => {
  // 指標の配列を作成
  const indicators = [
    { current: forestArea, target: targetForestArea },
    { current: waterSaved, target: targetWaterSaved },
    { current: co2Reduction, target: targetCo2Reduction },
  ];

  return calculateAverageProgress(indicators);
};

/**
 * 環境ランクを取得する
 */
export const getEcoRankFromDonation = (totalDonation: number): EcoRank => {
  return determineEcoRank(totalDonation);
};
