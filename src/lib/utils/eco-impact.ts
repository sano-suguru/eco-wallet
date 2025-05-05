/**
 * 環境貢献ランクを決定する
 * @param totalDonation 累計寄付額
 * @returns エコランク
 */
export function determineEcoRank(totalDonation: number): string {
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
  indicators: Array<{ current: number; target: number }>,
): number {
  if (indicators.length === 0) return 0;

  const totalProgress = indicators.reduce((sum, indicator) => {
    return sum + calculateProgressPercent(indicator.current, indicator.target);
  }, 0);

  return Math.round(totalProgress / indicators.length);
}
