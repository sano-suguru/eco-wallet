"use client";

import { useState, useMemo } from "react";
import {
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfMonth,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransactionStore } from "@/stores/slices/transaction";
import { FeaturedCampaignSection } from "@/components/campaigns/FeaturedCampaignSection";
import {
  BalanceOverview,
  TransactionFilters,
  TransactionList,
  EcoContributionSummary,
} from "@/components/history";

export default function TransactionHistoryPage() {
  // タブの選択状態
  const [selectedTab, setSelectedTab] = useState<
    "all" | "in" | "out" | "campaign" | "eco"
  >("all");

  // 期間選択の状態
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Zustand ストアからデータを取得
  const transactions = useTransactionStore((state) => state.transactions);

  // タブの変更ハンドラ
  const handleTabChange = (
    value: "all" | "in" | "out" | "campaign" | "eco",
  ) => {
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
          <BalanceOverview />

          <CardContent className="space-y-4">
            {/* フィルターセクション */}
            <TransactionFilters
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {/* 取引リスト */}
            <TransactionList
              transactions={filteredTransactions}
              initialLimit={10}
            />
          </CardContent>
        </Card>

        <FeaturedCampaignSection />

        <EcoContributionSummary />

        <p className="text-xs text-center text-stone-500">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
