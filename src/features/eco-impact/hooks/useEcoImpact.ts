"use client";

/**
 * 環境インパクト計算と管理に関するカスタムフック
 */
import { useMemo } from "react";
import { useEcoImpactStore } from "../store/eco-impact.slice";
import {
  calculateEcoImpact,
  getEcoRankFromDonation,
} from "../utils/calculations";
import { EcoRank } from "../types/eco-impact";

/**
 * 環境貢献に関するデータを提供するカスタムフック
 * 特定の寄付額を指定するか、ストアの総額を使用
 *
 * @param contributionAmount オプションの寄付金額
 */
export function useEcoImpact(contributionAmount?: number) {
  const ecoStore = useEcoImpactStore();

  // 環境インパクト計算（指定された金額または状態の合計から）
  const impact = useMemo(() => {
    const amount = contributionAmount ?? ecoStore.totalDonation;
    return calculateEcoImpact(amount);
  }, [contributionAmount, ecoStore.totalDonation]);

  // 進捗率計算
  const impactPercent = useMemo(
    () =>
      Math.min(
        100,
        Math.round(
          ((contributionAmount ?? ecoStore.totalDonation) / 1000) * 100,
        ),
      ),
    [contributionAmount, ecoStore.totalDonation],
  );

  // 環境ランク計算
  const ecoRank = useMemo<EcoRank>(
    () =>
      contributionAmount
        ? getEcoRankFromDonation(contributionAmount)
        : ecoStore.getEcoRank(),
    [contributionAmount, ecoStore],
  );

  return {
    ...impact,
    impactPercent,
    ecoRank,
    totalContribution: contributionAmount ?? ecoStore.totalDonation,
    // 現在のストア状態へのアクセス
    forestArea: ecoStore.forestArea,
    waterSaved: ecoStore.waterSaved,
    co2Reduction: ecoStore.co2Reduction,
    // ストアのアクションも公開
    addContribution: ecoStore.addContribution,
    updateProgress: ecoStore.updateProgress,
  };
}
