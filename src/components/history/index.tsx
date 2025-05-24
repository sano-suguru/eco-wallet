// 一時的なスタブコンポーネント
// TODO: 適切なfeatureモジュールに実装を移行する

import React from "react";
import { Transaction } from "@/shared/types/transaction";

export function BalanceOverview() {
  // TODO: features/balanceに適切な実装を作成
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-sm text-gray-600">Balance Overview Component</p>
    </div>
  );
}

interface TransactionFiltersProps {
  selectedTab: "all" | "in" | "out" | "campaign" | "eco";
  onTabChange: (value: "all" | "in" | "out" | "campaign" | "eco") => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TransactionFilters(props: TransactionFiltersProps) {
  // TODO: features/transactionsに適切な実装を作成
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-sm text-gray-600">Transaction Filters Component</p>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  initialLimit?: number;
}

export function TransactionList({
  transactions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialLimit = 10,
}: TransactionListProps) {
  // TODO: features/transactionsに適切な実装を作成
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-sm text-gray-600">
        Transaction List Component ({transactions.length} transactions)
      </p>
    </div>
  );
}

export function EcoContributionSummary() {
  // TODO: features/eco-impactに適切な実装を作成
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-sm text-gray-600">
        Eco Contribution Summary Component
      </p>
    </div>
  );
}
