/**
 * エコインパクト機能の型定義
 */

/**
 * 環境貢献ランクの型
 */
export type EcoRank =
  | "エコビギナー"
  | "エコフレンド"
  | "エコマイスター"
  | "エコチャンピオン";

/**
 * 環境貢献パラメータの型
 */
export interface ContributionParams {
  amount: number;
  forestArea?: number;
  waterSaved?: number;
  co2Reduction?: number;
}

/**
 * 環境インパクト計算結果の型
 */
export interface EcoImpactCalculation {
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
}
