"use client";

import React, { useState, useMemo } from "react";
import { Transaction } from "@/shared/types/transaction";
import {
  TransactionItem,
  StyledTransaction,
} from "@/features/transactions/components/TransactionItem";
import { getTransactionStyle } from "@/features/transactions/hooks/transactionStyling";
import { formatCurrency } from "@/shared/utils/formats";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  initialLimit?: number;
}

export function TransactionList({
  transactions,
  initialLimit = 10,
}: TransactionListProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit);

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const displayedTransactions = transactions.slice(0, displayLimit);
  const hasMore = transactions.length > displayLimit;

  // トランザクションをスタイル付きトランザクションに変換
  const styledTransactions: StyledTransaction[] = useMemo(() => {
    return displayedTransactions.map((transaction) => {
      // トランザクションタイプとバッジに基づいてスタイルを計算
      const style = getTransactionStyle(
        transaction.type,
        transaction.badges || [],
      );
      const formattedAmount = formatCurrency(transaction.amount);

      return {
        transaction,
        style,
        formattedAmount,
      };
    });
  }, [displayedTransactions]);

  if (transactions.length === 0) {
    return (
      <div className="bg-stone-50 rounded-lg p-8 text-center">
        <svg
          className="w-12 h-12 mx-auto text-stone-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-sm text-stone-600 font-medium">
          取引履歴はまだありません
        </p>
        <p className="text-xs text-stone-500 mt-1">
          取引を開始すると、ここに表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 取引リスト */}
      <div className="space-y-2">
        {styledTransactions.map((item) => (
          <TransactionItem key={item.transaction.id} item={item} />
        ))}
      </div>

      {/* もっと見るボタン */}
      {hasMore && (
        <div className="pt-4">
          <Button
            variant="ghost"
            onClick={handleShowMore}
            className="w-full h-10 text-sm font-medium text-stone-600 hover:text-teal-700 hover:bg-stone-50 group"
          >
            さらに表示
            <span className="ml-1 text-xs text-stone-500">
              ({transactions.length - displayLimit}件)
            </span>
            <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
