"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Search,
  CalendarDays,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  useSplitHistory,
  StatusFilter,
  SortType,
} from "../../hooks/useSplitHistory";
import { splitHistories } from "../../data/split-histories-data";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

export const SplitHistoryList = () => {
  const {
    filteredHistories,
    statusFilter,
    setStatusFilter,
    sortType,
    setSortType,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    statusCounts,
  } = useSplitHistory({ histories: splitHistories });

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "完了";
      case "pending":
        return "保留中";
      case "cancelled":
        return "キャンセル";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">割り勘履歴</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="text-teal-600"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* 検索バー */}
      {isSearchVisible && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            type="text"
            placeholder="タイトルで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* フィルタータブ */}
      <Tabs
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as StatusFilter)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">すべて ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="completed">
            完了 ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="pending">
            保留中 ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            キャンセル ({statusCounts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ソート */}
      <div className="flex items-center gap-2">
        <Select
          value={sortType}
          onValueChange={(value) => setSortType(value as SortType)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">日付</SelectItem>
            <SelectItem value="amount">金額</SelectItem>
            <SelectItem value="participants">人数</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSortOrder}
          className="text-teal-600"
        >
          {sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 履歴リスト */}
      <div className="space-y-3">
        {filteredHistories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-stone-500">履歴が見つかりません</p>
          </Card>
        ) : (
          filteredHistories.map((history) => (
            <Link key={history.id} href={`/transfer/split/${history.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-stone-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{history.title}</h3>
                        <Badge variant={getStatusBadgeVariant(history.status)}>
                          {getStatusLabel(history.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-600">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>
                            {format(new Date(history.date), "yyyy年MM月dd日", {
                              locale: ja,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{history.participantCount}人</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        ¥{history.amount.toLocaleString()}
                      </span>
                      <ChevronRight className="h-5 w-5 text-stone-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* 統計情報 */}
      {filteredHistories.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">統計情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-stone-600">合計金額</p>
                <p className="text-lg font-semibold">
                  ¥
                  {filteredHistories
                    .reduce((sum, h) => sum + h.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-stone-600">平均金額</p>
                <p className="text-lg font-semibold">
                  ¥
                  {Math.round(
                    filteredHistories.reduce((sum, h) => sum + h.amount, 0) /
                      filteredHistories.length,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
