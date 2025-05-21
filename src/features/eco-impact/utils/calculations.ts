import {
  EcoRank,
  ContributionParams,
  EcoImpactCalculation,
} from "../types/eco-impact";
import { EcoImpactSlice } from "../store/eco-impact.slice";

/**
 * 寄付額から環境インパクトを計算
 *
 * @param amount 寄付額 (円)
 */
export function calculateEcoImpact(amount: number): EcoImpactCalculation {
  // 換算係数（仮定値）
  const FOREST_FACTOR = 0.00042; // 1円あたり何平方メートルの森林が保全できるか
  const WATER_FACTOR = 0.036; // 1円あたり何リットルの水が節約できるか
  const CO2_FACTOR = 0.002; // 1円あたり何kgのCO2が削減できるか

  return {
    forestArea: parseFloat((amount * FOREST_FACTOR).toFixed(1)),
    waterSaved: Math.round(amount * WATER_FACTOR),
    co2Reduction: Math.round(amount * CO2_FACTOR),
  };
}

/**
 * 寄付額から環境貢献ランクを算出
 *
 * @param donation 寄付総額 (円)
 */
export function getEcoRankFromDonation(donation: number): EcoRank {
  if (donation >= 50000) return "エコチャンピオン";
  if (donation >= 10000) return "エコマイスター";
  if (donation >= 5000) return "エコフレンド";
  return "エコビギナー";
}

/**
 * 環境貢献の進捗率を計算
 */
export function calculateEcoProgress(
  forestArea: number,
  waterSaved: number,
  co2Reduction: number,
  targetForestArea: number,
  targetWaterSaved: number,
  targetCo2Reduction: number,
): number {
  // 各指標の進捗率を計算
  const forestProgress = (forestArea / targetForestArea) * 100;
  const waterProgress = (waterSaved / targetWaterSaved) * 100;
  const co2Progress = (co2Reduction / targetCo2Reduction) * 100;

  // 平均進捗率を計算し、整数に丸める
  return Math.round((forestProgress + waterProgress + co2Progress) / 3);
}

/**
 * 新しい環境貢献を追加した後の状態を計算
 */
export function calculateContribution(
  state: EcoImpactSlice,
  params: ContributionParams,
): Partial<EcoImpactSlice> {
  const { amount, forestArea = 0, waterSaved = 0, co2Reduction = 0 } = params;

  // 自動計算の場合はデフォルト係数を使用
  let forestAreaToAdd = forestArea;
  let waterSavedToAdd = waterSaved;
  let co2ReductionToAdd = co2Reduction;

  // もし外部から値が指定されていなければ自動計算
  if (forestArea === 0 && waterSaved === 0 && co2Reduction === 0) {
    const impact = calculateEcoImpact(amount);
    forestAreaToAdd = impact.forestArea;
    waterSavedToAdd = impact.waterSaved;
    co2ReductionToAdd = impact.co2Reduction;
  }

  // 新しい値を計算
  const newForestArea = parseFloat(
    (state.forestArea + forestAreaToAdd).toFixed(1),
  );
  const newWaterSaved = state.waterSaved + waterSavedToAdd;
  const newCo2Reduction = state.co2Reduction + co2ReductionToAdd;
  const newTotalDonation = state.totalDonation + amount;

  // 進捗率を再計算
  const newProgressPercent = calculateEcoProgress(
    newForestArea,
    newWaterSaved,
    newCo2Reduction,
    state.targetForestArea,
    state.targetWaterSaved,
    state.targetCo2Reduction,
  );

  return {
    forestArea: newForestArea,
    waterSaved: newWaterSaved,
    co2Reduction: newCo2Reduction,
    totalDonation: newTotalDonation,
    progressPercent: newProgressPercent,
  };
}
