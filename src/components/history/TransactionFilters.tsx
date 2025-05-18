"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Leaf } from "lucide-react";
import { PeriodSelector } from "./PeriodSelector";
import { useState, Dispatch, SetStateAction } from "react";
import { isSameMonth, isSameYear, format } from "date-fns";
import { ja } from "date-fns/locale";

type TabValue = "all" | "in" | "out" | "campaign" | "eco";
type PeriodMode = "thisMonth" | "lastMonth" | "last3Months" | "custom";

interface TransactionFiltersProps {
  selectedTab: TabValue;
  onTabChange: (value: TabValue) => void;
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
}

export function TransactionFilters({
  selectedTab,
  onTabChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: TransactionFiltersProps) {
  const [periodMode, setPeriodMode] = useState<PeriodMode>("thisMonth");

  // 期間表示テキストの生成
  const periodDisplayText = (() => {
    if (isSameMonth(startDate, endDate)) {
      // 同じ月の場合: 2025年4月
      return format(startDate, "yyyy年M月", { locale: ja });
    } else if (isSameYear(startDate, endDate)) {
      // 同じ年の場合: 2025年3月〜4月
      return `${format(startDate, "yyyy年M月", { locale: ja })}〜${format(endDate, "M月", { locale: ja })}`;
    } else {
      // 異なる年の場合: 2024年12月〜2025年1月
      return `${format(startDate, "yyyy年M月", { locale: ja })}〜${format(endDate, "yyyy年M月", { locale: ja })}`;
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          className="w-full"
          onValueChange={(value) => onTabChange(value as TabValue)}
        >
          <TabsList className="grid grid-cols-5 h-10 bg-stone-100 rounded-md p-0.5">
            <TabsTrigger value="all" className="text-xs rounded-md">
              すべて
            </TabsTrigger>
            <TabsTrigger value="in" className="text-xs rounded-md">
              入金
            </TabsTrigger>
            <TabsTrigger value="out" className="text-xs rounded-md">
              支払い
            </TabsTrigger>
            <TabsTrigger value="campaign" className="text-xs rounded-md">
              特典
            </TabsTrigger>
            <TabsTrigger value="eco" className="text-xs rounded-md">
              <Leaf className="h-3 w-3 mr-1" />
              環境貢献
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <PeriodSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            periodMode={periodMode}
            setPeriodMode={setPeriodMode}
          />

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 bg-white border-stone-200"
          >
            <Filter className="h-3 w-3 mr-1" /> 絞り込み
          </Button>
        </div>
        <div className="text-xs text-stone-500">{periodDisplayText}</div>
      </div>
    </div>
  );
}

export default TransactionFilters;
