/**
 * 環境貢献計算に関する関数
 */
import {
  EcoRank,
  ContributionParams,
  EcoState,
  EcoIndicator,
  EcoImpact,
} from "./types";

/**
 * 環境貢献ランクを決定する
 * @param totalDonation 累計寄付額
 * @returns エコランク
 */
export function determineEcoRank(totalDonation: number): EcoRank {
  if (totalDonation >= 50000) return "エコチャンピオン";
  if (totalDonation >= 20000) return "エコマイスター";
  if (totalDonation >= 5000) return "エコサポーター";
  return "エコビギナー";
}

/**
 * 環境貢献目標に対する進捗率を計算する
 * @param current 現在の値
 * @param target 目標値
 * @returns 進捗率（0-100）
 */
export function calculateProgressPercent(
  current: number,
  target: number,
): number {
  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
}

/**
 * 複数の環境指標の平均進捗率を計算する
 * @param indicators 指標の配列 { current, target }
 * @returns 平均進捗率
 */
export function calculateAverageProgress(
  indicators: Array<EcoIndicator>,
): number {
  if (indicators.length === 0) return 0;

  const totalProgress = indicators.reduce((sum, indicator) => {
    return sum + calculateProgressPercent(indicator.current, indicator.target);
  }, 0);

  return Math.round(totalProgress / indicators.length);
}

/**
 * 環境貢献インパクトを計算する
 * @param amount 金額
 * @returns 環境貢献データ
 */
export function calculateEcoImpact(amount: number): EcoImpact {
  return {
    forestArea: Number((amount * 0.0005).toFixed(2)), // 1000円で0.5m²
    waterSaved: Math.round(amount * 0.25), // 1000円で250L
    co2Reduction: Number((amount * 0.0125).toFixed(1)), // 1000円で12.5kg
  };
}

/**
 * 貢献データを計算する
 * @param state 現在の環境貢献状態
 * @param params 追加貢献のパラメータ
 * @returns 更新された環境貢献状態
 */
export function calculateContribution(
  state: EcoState,
  params: ContributionParams,
): Partial<EcoState> {
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
}

/**
 * 環境貢献の進捗を計算する
 */
export function calculateEcoProgress(
  forestArea: number,
  waterSaved: number,
  co2Reduction: number,
  targetForestArea: number,
  targetWaterSaved: number,
  targetCo2Reduction: number,
): number {
  // 指標の配列を作成
  const indicators = [
    { current: forestArea, target: targetForestArea },
    { current: waterSaved, target: targetWaterSaved },
    { current: co2Reduction, target: targetCo2Reduction },
  ];

  return calculateAverageProgress(indicators);
}

/**
 * 環境ランクを取得する
 */
export function getEcoRankFromDonation(totalDonation: number): EcoRank {
  return determineEcoRank(totalDonation);
}
