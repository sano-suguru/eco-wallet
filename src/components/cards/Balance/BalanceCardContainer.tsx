"use client";

import { useBalanceStore } from "@/stores/slices/balance";
import { formatCurrency } from "@/lib/utils/common";
import BalanceCardView from "./BalanceCardView";

// 残高データと加工を担当するコンテナコンポーネント
export default function BalanceCardContainer() {
  // Zustandストアからデータと関数を取得
  const getTotalBalance = useBalanceStore((state) => state.getTotalBalance);
  const campaignBalances = useBalanceStore((state) => state.campaignBalances);

  // 残高計算とデータ整形ロジック
  const campaignTotal = campaignBalances.reduce(
    (sum, cb) => sum + cb.amount,
    0,
  );

  const totalBalance = getTotalBalance();
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
