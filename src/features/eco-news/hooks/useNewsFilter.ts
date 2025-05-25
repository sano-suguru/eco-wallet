"use client";

import { useState, useMemo } from "react";
import { ContentItem, StatusFilter } from "../types/eco-news";

interface UseNewsFilterProps {
  items: ContentItem[];
}

export const useNewsFilter = ({ items }: UseNewsFilterProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let filtered = items;

    // ステータスフィルター
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.type === statusFilter);
    }

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const title = item.title.toLowerCase();
        const category = item.category.toLowerCase();

        if (item.type === "news") {
          return (
            title.includes(query) ||
            category.includes(query) ||
            item.content.toLowerCase().includes(query)
          );
        } else {
          return (
            title.includes(query) ||
            category.includes(query) ||
            item.description.toLowerCase().includes(query)
          );
        }
      });
    }

    return filtered;
  }, [items, statusFilter, searchQuery]);

  return {
    filteredItems,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  };
};
