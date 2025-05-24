import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

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
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* タブフィルター */}
          <Tabs
            value={selectedTab}
            onValueChange={(value) => onTabChange(value as typeof selectedTab)}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="in">入金</TabsTrigger>
              <TabsTrigger value="out">出金</TabsTrigger>
              <TabsTrigger value="campaign">キャンペーン</TabsTrigger>
              <TabsTrigger value="eco">エコ活動</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 日付フィルター */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "yyyy/MM/dd", { locale: ja })
                    : "開始日"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  locale={ja}
                />
              </PopoverContent>
            </Popover>

            <span className="flex items-center px-2">〜</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate
                    ? format(endDate, "yyyy/MM/dd", { locale: ja })
                    : "終了日"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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
      </CardContent>
    </Card>
  );
}
