"use client";

import { Leaf, Gift, Clock } from "lucide-react";
import { useBalanceStore } from "@/stores/slices/balance";
import { useTransactionStore } from "@/stores/slices/transaction";

// クレジットカードアイコンコンポーネント
const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export function BalanceOverview() {
  // Zustand ストアからデータを取得
  const balances = useBalanceStore((state) => state.campaignBalances);
  const regularBalance = useBalanceStore((state) => state.regularBalance);

  // 合計残高を計算
  const totalBalance = useBalanceStore((state) => state.getTotalBalance());

  // 環境貢献額を計算
  const totalEcoContribution = useTransactionStore((state) =>
    state.getTotalEcoContribution(),
  );

  return (
    <div className="px-6 py-3">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-stone-600">総残高</div>
        <div className="text-2xl font-bold text-teal-800">
          ¥{totalBalance.toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-md bg-stone-50 border border-stone-100">
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-stone-600 mr-3" />
            <div>
              <div className="text-sm font-medium text-stone-800">通常残高</div>
            </div>
          </div>
          <div className="text-sm font-medium text-stone-800">
            ¥{regularBalance.toLocaleString()}
          </div>
        </div>

        {balances.map((balance) => (
          <div
            key={balance.id}
            className="flex justify-between items-center p-3 rounded-md bg-amber-50 border border-amber-600 border-opacity-20"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-amber-100">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-stone-800">
                  {balance.label}
                </div>
                <div className="flex items-center text-xs text-amber-700 mt-0.5">
                  <Clock className="h-3 w-3 mr-1" />
                  あと{balance.daysLeft}日（{balance.expiryDate}まで）
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-amber-700">
              ¥{balance.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4 bg-teal-50 border border-teal-100 p-3 rounded-md">
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-teal-100 mr-3">
          <Leaf className="h-4 w-4 text-teal-700" />
        </div>
        <div>
          <div className="text-sm font-medium text-teal-800">
            環境貢献サマリー
          </div>
          <div className="text-xs text-teal-700 mt-1">
            今月の貢献額: ¥{totalEcoContribution.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalanceOverview;
