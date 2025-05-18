"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ja } from "date-fns/locale";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

type PeriodMode = "thisMonth" | "lastMonth" | "last3Months" | "custom";

interface PeriodSelectorProps {
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
  periodMode: PeriodMode;
  setPeriodMode: Dispatch<SetStateAction<PeriodMode>>;
}

export function PeriodSelector({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  periodMode,
  setPeriodMode,
}: PeriodSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const handleApplyPeriod = () => {
    // プリセットに応じた日付設定
    switch (periodMode) {
      case "thisMonth":
        setStartDate(startOfMonth(new Date()));
        setEndDate(new Date());
        break;
      case "lastMonth":
        const lastMonth = subMonths(new Date(), 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case "last3Months":
        setStartDate(subMonths(new Date(), 3));
        setEndDate(new Date());
        break;
      case "custom":
        // カスタムの場合はすでに選択されている
        break;
    }
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-9 bg-white border-stone-200 hover:bg-stone-50"
        >
          <Calendar className="h-4 w-4 mr-2 text-teal-700" /> 期間
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* プリセットタブ */}
          <Tabs
            defaultValue={periodMode}
            onValueChange={(value) => setPeriodMode(value as PeriodMode)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="thisMonth" className="text-xs">
                今月
              </TabsTrigger>
              <TabsTrigger value="lastMonth" className="text-xs">
                先月
              </TabsTrigger>
              <TabsTrigger value="last3Months" className="text-xs">
                過去3ヶ月
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs">
                カスタム
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* カスタム期間選択 */}
          {periodMode === "custom" && (
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-stone-600 mb-1">開始月</div>
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    disabled={(date) => date > endDate}
                    initialFocus
                    showOutsideDays={false}
                    locale={ja}
                    className="rounded-md border"
                    classNames={{
                      day_selected: "bg-teal-700 text-white hover:bg-teal-600",
                      day_today: "bg-teal-50 text-teal-700",
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs text-stone-600 mb-1">終了月</div>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => date < startDate}
                    initialFocus
                    showOutsideDays={false}
                    locale={ja}
                    className="rounded-md border"
                    classNames={{
                      day_selected: "bg-teal-700 text-white hover:bg-teal-600",
                      day_today: "bg-teal-50 text-teal-700",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 選択期間の表示 */}
          <div className="pt-2 text-xs text-stone-600">
            選択中の期間: {format(startDate, "yyyy/MM/dd", { locale: ja })} 〜{" "}
            {format(endDate, "yyyy/MM/dd", { locale: ja })}
          </div>

          {/* アクション */}
          <div className="flex justify-between space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
              className="text-xs"
            >
              キャンセル
            </Button>
            <Button
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
              onClick={handleApplyPeriod}
            >
              期間を適用
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PeriodSelector;
