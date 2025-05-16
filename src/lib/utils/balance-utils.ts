/**
 * バランス関連の計算ユーティリティ関数
 */

/**
 * キャンペーン残高の型定義
 */
export type CampaignBalance = {
  id: number;
  amount: number;
  label: string;
  expiryDate: string;
  daysLeft: number;
  conditions?: string;
};

/**
 * 通常残高とキャンペーン残高から合計残高を計算する
 */
export const calculateTotalBalance = (
  regularBalance: number,
  campaignBalances: CampaignBalance[],
): number => {
  const campaignTotal = campaignBalances.reduce(
    (sum, cb) => sum + cb.amount,
    0,
  );
  return regularBalance + campaignTotal;
};
