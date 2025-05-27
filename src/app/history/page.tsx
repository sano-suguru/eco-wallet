"use client";

import { useState, useMemo } from "react";
import {
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfMonth,
} from "date-fns";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";
import { FeaturedCampaignSection } from "@/features/campaigns";
import { BalanceOverview } from "@/features/balance";
import { TransactionFilters, TransactionList } from "@/features/transactions";
import { EcoContributionSummary } from "@/features/eco-impact";
import { ArrowLeft, TrendingUp, Leaf } from "lucide-react";
import Link from "next/link";
import { AppError } from "@/shared/types/errors";
import { ErrorDisplay } from "@/components/ui/error-display";
import { showAppErrorNotification } from "@/shared/stores/app.slice";

export default function TransactionHistoryPage() {
  // タブの選択状態
  const [selectedTab, setSelectedTab] = useState<
    "all" | "in" | "out" | "campaign" | "eco"
  >("all");

  // 期間選択の状態
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // エラーステート管理（Result型対応）
  const [error, setError] = useState<AppError | null>(null);

  // Zustand ストアからデータとメソッドを取得（Result型対応）
  const transactions = useTransactionStore((state) => state.transactions);
  const getTransactionsByType = useTransactionStore(
    (state) => state.getTransactionsByType,
  );
  const getTransactionsWithEcoContribution = useTransactionStore(
    (state) => state.getTransactionsWithEcoContribution,
  );
  const getTotalEcoContribution = useTransactionStore(
    (state) => state.getTotalEcoContribution,
  );

  // エラー再試行ハンドラ（Result型対応）
  const handleRetry = () => {
    setError(null);
    // フィルタリングを再実行（特にAPIアクセスが必要な場合）
    handleTabChange(selectedTab);
  };

  // タブの変更ハンドラ（Result型対応エラーハンドリング）
  const handleTabChange = (
    value: "all" | "in" | "out" | "campaign" | "eco",
  ) => {
    setSelectedTab(value);
    setError(null); // タブ変更時にエラーをクリア

    // 特定のタブでResult型メソッドを活用
    if (value === "eco") {
      const ecoResult = getTransactionsWithEcoContribution();
      ecoResult.match(
        () => {
          // 成功時は特に何もしない（フィルタリングはuseMemoで処理）
        },
        (error) => {
          setError(error);
          showAppErrorNotification(error, "環境貢献取引の取得エラー");
        },
      );
    }
  };

  // フィルタリングされた取引リストを計算（Result型統合）
  const filteredTransactions = useMemo(() => {
    try {
      // タイプでフィルタリング（Result型メソッド活用）
      let result = transactions;

      switch (selectedTab) {
        case "in":
          // 入金: charge と receive タイプの取引
          const chargeResult = getTransactionsByType("charge");
          const receiveResult = getTransactionsByType("receive");

          if (chargeResult.isOk() && receiveResult.isOk()) {
            const chargeTransactions = chargeResult.value;
            const receiveTransactions = receiveResult.value;
            result = [...chargeTransactions, ...receiveTransactions];
          } else {
            // フォールバック: 従来のフィルタリング
            result = result.filter(
              (tx) => tx.type === "charge" || tx.type === "receive",
            );
          }
          break;
        case "out":
          // 支払い: payment タイプの取引
          const paymentResult = getTransactionsByType("payment");
          if (paymentResult.isOk()) {
            result = paymentResult.value;
          } else {
            // フォールバック: 従来のフィルタリング
            result = result.filter((tx) => tx.type === "payment");
          }
          break;
        case "campaign":
          // 特典: 特典バッジを持つ取引
          result = result.filter(
            (tx) => tx.badges && tx.badges.includes("特典"),
          );
          break;
        case "eco":
          // 環境貢献: 環境貢献のある取引（Result型メソッド活用）
          const ecoResult = getTransactionsWithEcoContribution();
          if (ecoResult.isOk()) {
            result = ecoResult.value;
          } else {
            // フォールバック: 従来のフィルタリング
            result = result.filter((tx) => tx.ecoContribution?.enabled);
          }
          break;
        default:
          // "all": すべての取引を表示
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
    } catch (error) {
      // フィルタリング処理でエラーが発生した場合
      console.error("Transaction filtering error:", error);
      const appError: AppError = {
        type: "NETWORK_ERROR",
        message: "取引データの処理中にエラーが発生しました",
      };
      setError(appError);
      showAppErrorNotification(appError, "取引履歴エラー");
      return []; // 空の配列を返してアプリケーションの継続を許可
    }
  }, [
    transactions,
    selectedTab,
    startDate,
    endDate,
    getTransactionsByType,
    getTransactionsWithEcoContribution,
  ]);

  // 統計情報の計算（Result型対応）
  const statistics = useMemo(() => {
    try {
      const totalIncome = filteredTransactions
        .filter((tx) => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalExpense = filteredTransactions
        .filter((tx) => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      // 環境貢献合計をResult型メソッドで計算
      const ecoContributionResult = getTotalEcoContribution();
      let totalEcoContribution = 0;

      if (ecoContributionResult.isOk()) {
        totalEcoContribution = ecoContributionResult.value;
      } else {
        // フォールバック: 従来の計算方法
        totalEcoContribution = filteredTransactions
          .filter((tx) => tx.ecoContribution?.enabled)
          .reduce((sum, tx) => sum + (tx.ecoContribution?.amount || 0), 0);
      }

      return {
        totalIncome,
        totalExpense,
        totalEcoContribution,
      };
    } catch (error) {
      console.error("Statistics calculation error:", error);
      return {
        totalIncome: 0,
        totalExpense: 0,
        totalEcoContribution: 0,
      };
    }
  }, [filteredTransactions, getTotalEcoContribution]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-600 hover:text-teal-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xs font-medium">ホーム</span>
            </Link>
            <h1 className="text-lg font-semibold text-stone-900">取引履歴</h1>
            <div className="w-16" /> {/* スペーサー */}
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* エラー表示（Result型対応） */}
        {error && (
          <ErrorDisplay error={error} onRetry={handleRetry} className="mb-4" />
        )}

        {/* 統計サマリー */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-stone-500 mb-1">入金合計</p>
              <p className="text-lg font-semibold text-blue-600">
                ¥{statistics.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-stone-100">
              <p className="text-xs text-stone-500 mb-1">支払合計</p>
              <p className="text-lg font-semibold text-stone-700">
                ¥{statistics.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-stone-500 mb-1">環境貢献</p>
              <p className="text-lg font-semibold text-teal-600">
                ¥{statistics.totalEcoContribution.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 残高情報 */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-700">残高情報</h2>
          </div>
          <BalanceOverview />
        </div>

        {/* フィルター */}
        <div>
          <TransactionFilters
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>

        {/* 取引リスト */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-700">
              取引一覧
              <span className="ml-2 text-xs text-stone-500">
                ({filteredTransactions.length}件)
              </span>
            </h3>
            {filteredTransactions.length > 0 && (
              <TrendingUp className="h-4 w-4 text-stone-400" />
            )}
          </div>
          <TransactionList
            transactions={filteredTransactions}
            initialLimit={10}
          />
        </div>

        {/* キャンペーン情報 */}
        <div className="pt-2">
          <FeaturedCampaignSection />
        </div>

        {/* 環境貢献サマリー */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <Leaf className="h-4 w-4 text-teal-700" />
            </div>
            <h3 className="text-sm font-medium text-teal-800">
              あなたの環境への貢献
            </h3>
          </div>
          <EcoContributionSummary />
        </div>

        {/* フッターメッセージ */}
        <div className="text-center py-6">
          <p className="text-xs text-stone-500">
            お客様の購入ごとに、売上の1%を
            <br />
            環境保護団体に寄付しています
          </p>
        </div>
      </div>
    </div>
  );
}
