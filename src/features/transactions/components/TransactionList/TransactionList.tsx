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
import { Card, CardContent } from "@/components/ui/card";

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
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">取引履歴がありません</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {styledTransactions.map((item) => (
          <TransactionItem key={item.transaction.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleShowMore}
            className="w-full sm:w-auto"
          >
            さらに表示 ({transactions.length - displayLimit}件)
          </Button>
        </div>
      )}
    </div>
  );
}
