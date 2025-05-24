"use client";

import { useState, useMemo } from "react";
import { SplitHistory } from "../types/transfer";

export type SortType = "date" | "amount" | "participants";
export type SortOrder = "asc" | "desc";
export type StatusFilter = "all" | "completed" | "pending" | "cancelled";

interface UseSplitHistoryProps {
  histories: SplitHistory[];
}

export const useSplitHistory = ({ histories }: UseSplitHistoryProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortType, setSortType] = useState<SortType>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedHistories = useMemo(() => {
    // フィルタリング
    let filtered = histories;

    // ステータスフィルター
    if (statusFilter !== "all") {
      filtered = filtered.filter((history) => history.status === statusFilter);
    }

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter((history) =>
        history.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortType) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "participants":
          comparison = a.participantCount - b.participantCount;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [histories, statusFilter, sortType, sortOrder, searchQuery]);

  // ステータス別の件数を計算
  const statusCounts = useMemo(() => {
    return histories.reduce(
      (acc, history) => {
        acc[history.status] = (acc[history.status] || 0) + 1;
        acc.all += 1;
        return acc;
      },
      { all: 0, completed: 0, pending: 0, cancelled: 0 },
    );
  }, [histories]);

  return {
    filteredHistories: filteredAndSortedHistories,
    statusFilter,
    setStatusFilter,
    sortType,
    setSortType,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    statusCounts,
  };
};
