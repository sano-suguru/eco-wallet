"use client";

import { useState, useMemo } from "react";
import { ja } from "date-fns/locale";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
  isSameMonth,
  isSameYear,
} from "date-fns";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  ArrowDown,
  ArrowUp,
  Calendar,
  Filter,
  Clock,
  AlertCircle,
  Gift,
  Info,
  Tag,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTransactionStore } from "@/stores/slices/transaction";
import { useBalanceStore } from "@/stores/slices/balance";
import { FeaturedCampaignSection } from "@/components/campaigns/FeaturedCampaignSection";

// アイコンコンポーネント
const CreditCard = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export default function TransactionHistoryPage() {
  // タブの選択状態
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // 表示件数の制限とローディング状態
  const [displayLimit, setDisplayLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 期間選択の状態
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [periodMode, setPeriodMode] = useState<
    "thisMonth" | "lastMonth" | "last3Months" | "custom"
  >("thisMonth");

  // 期間表示テキストの生成
  const periodDisplayText = useMemo(() => {
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
  }, [startDate, endDate]);

  // Zustand ストアからデータを取得
  const transactions = useTransactionStore((state) => state.transactions);
  const balances = useBalanceStore((state) => state.campaignBalances);
  const regularBalance = useBalanceStore((state) => state.regularBalance);

  // 合計残高を計算
  const totalBalance = useBalanceStore((state) => state.getTotalBalance());

  // 環境貢献額を計算
  const totalEcoContribution = useTransactionStore((state) =>
    state.getTotalEcoContribution(),
  );

  // タブの変更ハンドラ
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  // フィルタリングされた取引リストを計算
  const filteredTransactions = useMemo(() => {
    // タイプでフィルタリング
    let result = transactions;

    switch (selectedTab) {
      case "in":
        // 入金: charge と receive タイプの取引
        result = result.filter(
          (tx) => tx.type === "charge" || tx.type === "receive",
        );
        break;
      case "out":
        // 支払い: payment タイプの取引
        result = result.filter((tx) => tx.type === "payment");
        break;
      case "campaign":
        // 特典: 特典バッジを持つ取引
        result = result.filter((tx) => tx.badges && tx.badges.includes("特典"));
        break;
      case "eco":
        // 環境貢献: 環境貢献のある取引
        result = result.filter((tx) => tx.ecoContribution?.enabled);
        break;
    }

    // 日付でフィルタリング
    result = result.filter((tx) => {
      try {
        // 文字列形式の日付をDateオブジェクトに変換
        // "2025/04/15" 形式か "2025年4月15日" 形式かチェック
        let txDate: Date;

        if (typeof tx.date === "string") {
          if (tx.date.includes("/")) {
            // yyyy/mm/dd 形式
            txDate = parseISO(tx.date.replace(/\//g, "-"));
          } else if (tx.date.includes("年")) {
            // yyyy年mm月dd日 形式
            const matched = tx.date.match(/(\d+)年(\d+)月(\d+)日/);
            if (matched) {
              txDate = new Date(
                parseInt(matched[1]),
                parseInt(matched[2]) - 1,
                parseInt(matched[3]),
              );
            } else {
              txDate = new Date(tx.date);
            }
          } else {
            // その他の形式
            txDate = new Date(tx.date);
          }
        } else if (tx.date && typeof tx.date === "object") {
          // 日付オブジェクトとして扱う
          txDate = new Date(tx.date as Date);
        } else {
          // 日付として解釈できない場合はフィルタから除外しない
          return true;
        }

        // 開始日の00:00:00から終了日の23:59:59までの範囲でフィルタリング
        return isWithinInterval(txDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      } catch (e) {
        // 日付解析エラーの場合は表示する（フィルタから除外しない）
        console.error("Date parsing error:", e);
        return true;
      }
    });

    return result;
  }, [transactions, selectedTab, startDate, endDate]);

  // 「もっと見る」ボタンのクリックハンドラ
  const handleLoadMore = () => {
    // ローディング状態をアクティブに
    setIsLoading(true);

    // 実際のデータ取得はローカルなので、タイムアウトで遅延をシミュレート
    setTimeout(() => {
      setDisplayLimit((prev) => prev + 10);
      // ローディング状態を解除
      setIsLoading(false);
    }, 500); // 0.5秒の遅延（UXの観点から短めに設定）
  };

  // 表示用のトランザクションを制限
  const displayedTransactions = filteredTransactions.slice(0, displayLimit);

  // 全件表示されているかチェック
  const hasMoreTransactions = filteredTransactions.length > displayLimit;

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <svg viewBox="0 0 100 40" className="h-12 w-auto fill-teal-700">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Eco Wallet
          </h1>
          <p className="text-sm text-stone-600">
            シンプルで環境に優しい決済サービス
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-teal-800">取引履歴</CardTitle>
            <CardDescription>あなたの取引と環境への貢献</CardDescription>
          </CardHeader>

          {/* 残高情報セクション */}
          <div className="px-6 py-3">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-stone-600">総残高</div>
              <div className="text-2xl font-bold text-teal-800">
                ¥{totalBalance.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-md bg-stone-50 border border-stone-100">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-stone-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      通常残高
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-stone-800">
                  ¥{regularBalance.toLocaleString()}
                </div>
              </div>

              {balances.map((balance) => (
                <div
                  key={balance.id}
                  className="flex justify-between items-center p-3 rounded-md bg-amber-50 border border-amber-600 border-opacity-20"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-amber-100">
                      <Gift className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-stone-800">
                        {balance.label}
                      </div>
                      <div className="flex items-center text-xs text-amber-700 mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        あと{balance.daysLeft}日（{balance.expiryDate}まで）
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-amber-700">
                    ¥{balance.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center mt-4 bg-teal-50 border border-teal-100 p-3 rounded-md">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-teal-100 mr-3">
                <Leaf className="h-4 w-4 text-teal-700" />
              </div>
              <div>
                <div className="text-sm font-medium text-teal-800">
                  環境貢献サマリー
                </div>
                <div className="text-xs text-teal-700 mt-1">
                  今月の貢献額: ¥{totalEcoContribution.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={handleTabChange}
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
                        onValueChange={(value) =>
                          setPeriodMode(
                            value as
                              | "thisMonth"
                              | "lastMonth"
                              | "last3Months"
                              | "custom",
                          )
                        }
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
                              <div className="text-xs text-stone-600 mb-1">
                                開始月
                              </div>
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
                                  day_selected:
                                    "bg-teal-700 text-white hover:bg-teal-600",
                                  day_today: "bg-teal-50 text-teal-700",
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-xs text-stone-600 mb-1">
                                終了月
                              </div>
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
                                  day_selected:
                                    "bg-teal-700 text-white hover:bg-teal-600",
                                  day_today: "bg-teal-50 text-teal-700",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 選択期間の表示 */}
                      <div className="pt-2 text-xs text-stone-600">
                        選択中の期間:{" "}
                        {format(startDate, "yyyy/MM/dd", { locale: ja })} 〜{" "}
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
                          onClick={() => {
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
                          }}
                        >
                          期間を適用
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

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

            <div className="space-y-3">
              {displayedTransactions.map((transaction) => (
                <Link href={`/history/${transaction.id}`} key={transaction.id}>
                  <div
                    className={`bg-white border shadow-sm ${
                      transaction.badges?.includes("特典") ||
                      transaction.type === "receive"
                        ? "border-amber-200"
                        : transaction.badges?.includes("期限切れ") ||
                            transaction.type === "expired"
                          ? "border-red-200"
                          : "border-stone-200"
                    } rounded-lg p-4 hover:bg-stone-50 transition-colors`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "charge" ||
                            transaction.type === "receive"
                              ? "bg-blue-50 text-blue-600"
                              : transaction.badges?.includes("特典")
                                ? "bg-amber-50 text-amber-600"
                                : transaction.type === "expired" ||
                                    transaction.badges?.includes("期限切れ")
                                  ? "bg-red-50 text-red-600"
                                  : "bg-stone-50 text-stone-600"
                          }`}
                        >
                          {transaction.type === "charge" ||
                          transaction.type === "receive" ? (
                            <ArrowDown className="h-5 w-5" />
                          ) : transaction.type === "payment" ? (
                            <ArrowUp className="h-5 w-5" />
                          ) : transaction.badges?.includes("特典") ? (
                            <Gift className="h-5 w-5" />
                          ) : transaction.type === "expired" ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <Info className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="text-sm font-medium text-stone-800">
                              {transaction.description}
                            </h4>
                            {transaction.ecoContribution?.enabled && (
                              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 text-xs border border-teal-200">
                                <Leaf className="h-3 w-3 mr-1" /> 環境貢献
                              </Badge>
                            )}
                            {transaction.badges?.includes("特典") && (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs border border-amber-200">
                                <Gift className="h-3 w-3 mr-1" /> 特典
                              </Badge>
                            )}
                            {transaction.badges?.includes("期限切れ") && (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-200 text-xs border border-red-200">
                                <AlertCircle className="h-3 w-3 mr-1" />{" "}
                                期限切れ
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-base font-medium ${
                          transaction.amount < 0
                            ? "text-stone-700"
                            : transaction.type === "receive" ||
                                transaction.badges?.includes("特典")
                              ? "text-amber-700"
                              : "text-blue-700"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}¥
                        {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>

                    {transaction.type === "receive" &&
                      transaction.badges?.includes("特典") && (
                        <div className="mt-3 ml-12 text-xs bg-amber-50 rounded-md p-3 border border-amber-200">
                          <div className="flex items-center text-amber-700">
                            <Tag className="h-4 w-4 mr-2" />
                            <span className="font-medium">
                              友達紹介プログラム
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-amber-700">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>有効期限: 2025/04/30</span>
                          </div>
                        </div>
                      )}

                    {transaction.type === "expired" && (
                      <div className="mt-3 ml-12 text-xs bg-red-50 rounded-md p-3 border border-red-200">
                        <div className="flex items-center text-red-700">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span>エコポイントの残高が期限切れになりました</span>
                        </div>
                      </div>
                    )}

                    {transaction.ecoContribution?.enabled && (
                      <div className="mt-3 ml-12 text-xs bg-teal-50 p-3 rounded-md border border-teal-200">
                        <div className="flex items-center text-teal-700">
                          <Leaf className="h-4 w-4 mr-2" />
                          <span className="font-medium">環境保全寄付</span>
                          <span className="ml-2 font-medium">
                            ¥
                            {transaction.ecoContribution.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {hasMoreTransactions && (
              <Button
                variant="ghost"
                className="w-full text-stone-600 border border-stone-200 hover:bg-stone-50"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    読み込み中...
                  </div>
                ) : (
                  "もっと見る"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <FeaturedCampaignSection />

        <div className="bg-teal-50 border border-teal-100 rounded-md p-3">
          <div className="flex items-start space-x-3">
            <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-teal-800">
                あなたの環境への貢献
              </h4>
              <p className="text-xs text-teal-700 mt-1">
                これまでの累計寄付額：¥12,450
              </p>
              <p className="text-xs text-teal-700 mt-1">
                あなたの取引によって保全された森林面積：5平方メートル
              </p>
              <p className="text-xs text-teal-700 mt-1">
                削減されたCO2排出量：25kg
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-stone-500">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
