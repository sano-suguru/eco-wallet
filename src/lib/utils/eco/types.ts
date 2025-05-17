/**
 * 環境貢献に関する型定義
 */

/**
 * 環境貢献ランクの定義
 */
export type EcoRank =
  | "エコビギナー"
  | "エコサポーター"
  | "エコマイスター"
  | "エコチャンピオン";

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
 * 環境貢献状態の型定義
 */
export interface EcoState {
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
  totalDonation: number;
  monthlyDonation: number;
}

/**
 * 環境貢献インパクトの型定義
 */
export interface EcoImpact {
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
}
