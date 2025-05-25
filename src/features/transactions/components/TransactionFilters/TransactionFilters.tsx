import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TransactionFiltersProps {
  selectedTab: "all" | "in" | "out" | "campaign" | "eco";
  onTabChange: (value: "all" | "in" | "out" | "campaign" | "eco") => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}

export function TransactionFilters({
  selectedTab,
  onTabChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-4">
      {/* タブフィルター - よりシンプルで洗練されたデザイン */}
      <Tabs
        value={selectedTab}
        onValueChange={(value) => onTabChange(value as typeof selectedTab)}
      >
        <TabsList className="grid w-full grid-cols-5 bg-stone-100 p-1 h-10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm text-xs font-medium"
          >
            すべて
          </TabsTrigger>
          <TabsTrigger
            value="in"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-xs font-medium"
          >
            入金
          </TabsTrigger>
          <TabsTrigger
            value="out"
            className="data-[state=active]:bg-white data-[state=active]:text-stone-700 data-[state=active]:shadow-sm text-xs font-medium"
          >
            支払い
          </TabsTrigger>
          <TabsTrigger
            value="campaign"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-xs font-medium"
          >
            特典
          </TabsTrigger>
          <TabsTrigger
            value="eco"
            className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm text-xs font-medium"
          >
            環境
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 日付フィルター - より洗練されたデザイン */}
      <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-lg">
        <Filter className="h-4 w-4 text-stone-500" />
        <span className="text-xs text-stone-600">期間:</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 px-3 text-xs font-normal text-stone-700 hover:bg-white hover:text-teal-700 justify-start"
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {format(startDate, "MM/dd", { locale: ja })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              initialFocus
              locale={ja}
            />
          </PopoverContent>
        </Popover>

        <span className="text-xs text-stone-500">〜</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 px-3 text-xs font-normal text-stone-700 hover:bg-white hover:text-teal-700 justify-start"
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {format(endDate, "MM/dd", { locale: ja })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              initialFocus
              locale={ja}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
