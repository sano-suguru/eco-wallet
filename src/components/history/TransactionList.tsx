"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "./TransactionItem";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  badges?: string[];
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
}

interface TransactionListProps {
  transactions: Transaction[];
  initialLimit?: number;
}

export function TransactionList({
  transactions,
  initialLimit = 10,
}: TransactionListProps) {
  // 表示件数の制限とローディング状態
  const [displayLimit, setDisplayLimit] = useState<number>(initialLimit);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 「もっと見る」ボタンのクリックハンドラ
  const handleLoadMore = () => {
    // ローディング状態をアクティブに
    setIsLoading(true);

    // 実際のデータ取得はローカルなので、タイムアウトで遅延をシミュレート
    setTimeout(() => {
      setDisplayLimit((prev) => prev + 10);
      // ローディング状態を解除
      setIsLoading(false);
    }, 500); // 0.5秒の遅延（UXの観点から短めに設定）
  };

  // 表示用のトランザクションを制限
  const displayedTransactions = transactions.slice(0, displayLimit);

  // 全件表示されているかチェック
  const hasMoreTransactions = transactions.length > displayLimit;

  if (transactions.length === 0) {
    return (
      <div className="text-center p-6 bg-stone-50 rounded-lg">
        <p className="text-stone-600">表示する取引はありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedTransactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}

      {hasMoreTransactions && (
        <Button
          variant="ghost"
          className="w-full text-stone-600 border border-stone-200 hover:bg-stone-50"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              読み込み中...
            </div>
          ) : (
            "もっと見る"
          )}
        </Button>
      )}
    </div>
  );
}

export default TransactionList;
