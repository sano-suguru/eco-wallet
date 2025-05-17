"use client";

/**
 * トランザクションフィルタリング用カスタムフック
 */
import { useState, useMemo, useCallback } from "react";
import { useTransactionStore } from "@/stores";
import { TransactionType, Transaction } from "@/lib/utils/transactions/types";

interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * トランザクションフィルタリングのためのカスタムフック
 */
export function useTransactionFilters() {
  // フィルター状態
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [showEcoOnly, setShowEcoOnly] = useState<boolean>(false);

  // トランザクションストアからデータ取得
  const transactions = useTransactionStore((state) => state.transactions);
  const getTransactionsByType = useTransactionStore(
    (state) => state.getTransactionsByType,
  );
  const getTransactionsWithEcoContribution = useTransactionStore(
    (state) => state.getTransactionsWithEcoContribution,
  );
  const getTransactionsByDateRange = useTransactionStore(
    (state) => state.getTransactionsByDateRange,
  );

  // フィルター設定ハンドラー
  const handleTypeFilterChange = useCallback(
    (type: TransactionType | "all") => {
      setTypeFilter(type);
    },
    [],
  );

  const handleDateRangeChange = useCallback((range: DateRange | null) => {
    setDateRange(range);
  }, []);

  const handleEcoFilterChange = useCallback((showEco: boolean) => {
    setShowEcoOnly(showEco);
  }, []);

  // フィルター適用済みトランザクションを計算
  const filteredTransactions = useMemo<Transaction[]>(() => {
    // ベーストランザクション（タイプフィルター適用）
    let result =
      typeFilter === "all"
        ? [...transactions]
        : getTransactionsByType(typeFilter);

    // 日付範囲フィルター適用
    if (dateRange) {
      result = result.filter((tx) =>
        getTransactionsByDateRange(dateRange.startDate, dateRange.endDate).some(
          (dateTx) => dateTx.id === tx.id,
        ),
      );
    }

    // エコ貢献フィルター適用
    if (showEcoOnly) {
      const ecoTransactions = getTransactionsWithEcoContribution();
      result = result.filter((tx) =>
        ecoTransactions.some((ecoTx) => ecoTx.id === tx.id),
      );
    }

    return result;
  }, [
    transactions,
    typeFilter,
    dateRange,
    showEcoOnly,
    getTransactionsByType,
    getTransactionsByDateRange,
    getTransactionsWithEcoContribution,
  ]);

  return {
    // 状態
    typeFilter,
    dateRange,
    showEcoOnly,
    // 結果
    filteredTransactions,
    // アクション
    setTypeFilter: handleTypeFilterChange,
    setDateRange: handleDateRangeChange,
    setShowEcoOnly: handleEcoFilterChange,
  };
}
