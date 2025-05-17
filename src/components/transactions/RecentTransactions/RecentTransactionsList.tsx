"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionItem, { StyledTransaction } from "./TransactionItem";

interface RecentTransactionsListProps {
  transactions: StyledTransaction[];
  showHeader?: boolean;
}

// プレゼンテーションコンポーネント：スタイリング済みトランザクションの表示のみを担当
const RecentTransactionsList = React.memo(
  ({ transactions, showHeader = true }: RecentTransactionsListProps) => {
    return (
      <div>
        {showHeader && (
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-stone-800">最近の取引</h3>
            <Link href="/history">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-stone-500"
              >
                すべて見る
              </Button>
            </Link>
          </div>
        )}

        <Card className="border-0 shadow-md bg-white divide-y divide-stone-100">
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <TransactionItem key={item.transaction.id} item={item} />
            ))
          ) : (
            <div className="p-4 text-center text-stone-500 text-sm">
              取引履歴がありません
            </div>
          )}
        </Card>
      </div>
    );
  },
);

RecentTransactionsList.displayName = "RecentTransactionsList";

export default RecentTransactionsList;
