"use client";

import { useBalanceStore } from "../../store/balance.slice";
import { formatCurrency } from "@/shared/utils/formats";
import { BalanceCardView } from "./BalanceCardView";
import { BalanceCardContainerProps } from "../../types/balance";

/**
 * 残高データを取得・加工し、表示コンポーネントに渡すコンテナコンポーネント
 *
 * @param className オプションのCSSクラス
 */
export function BalanceCardContainer({} /* className */ : BalanceCardContainerProps) {
  // Zustandストアからデータと関数を取得
  const getTotalBalance = useBalanceStore((state) => state.getTotalBalance);
  const campaignBalances = useBalanceStore((state) => state.campaignBalances);

  // 残高計算とデータ整形ロジック
  const campaignTotal = campaignBalances.reduce(
    (sum, cb) => sum + cb.amount,
    0,
  );

  const totalBalanceResult = getTotalBalance();
  const totalBalance = totalBalanceResult.isOk() ? totalBalanceResult.value : 0;
  const formattedBalance = formatCurrency(totalBalance);

  // 期限が近い（7日以内）キャンペーン残高があるかチェック
  const hasExpiringBalance = campaignBalances.some((cb) => cb.daysLeft <= 7);

  // 加工済みのデータをプレゼンテーションコンポーネントに渡す
  return (
    <BalanceCardView
      formattedBalance={formattedBalance}
      campaignTotal={campaignTotal}
      hasExpiringBalance={hasExpiringBalance}
    />
  );
}
