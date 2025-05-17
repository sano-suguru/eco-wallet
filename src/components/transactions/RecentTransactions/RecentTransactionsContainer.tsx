"use client";

import { useState, useEffect, useMemo } from "react";
import { useTransactionStore } from "@/stores/slices/transaction";
import { Transaction } from "@/lib/mock-data/transactions";
import { useTransactionStyling } from "@/hooks";
import RecentTransactionsList from "./RecentTransactionsList";
import { StyledTransaction } from "./TransactionItem";

interface RecentTransactionsContainerProps {
  limit?: number;
  showHeader?: boolean;
}

// コンテナコンポーネント: データ取得とビジネスロジックを担当
export default function RecentTransactionsContainer({
  limit = 3,
  showHeader = true,
}: RecentTransactionsContainerProps) {
  // 取引データの状態管理
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // トランザクション取得関数をストアから取得
  const getRecentTransactions = useTransactionStore(
    (state) => state.getRecentTransactions,
  );

  // React Hook のルールを守るため、トップレベルでフックを1回呼び出す
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useTransactionStyling("payment", []);

  // トランザクションデータをフェッチ
  useEffect(() => {
    const recentTransactions = getRecentTransactions(limit);
    setTransactions(recentTransactions);
  }, [getRecentTransactions, limit]);

  // スタイル適用済みトランザクションを生成（データとスタイルを結合）
  const styledTransactions: StyledTransaction[] = useMemo(() => {
    return transactions.map((tx) => {
      // スタイル設定
      let styleConfig = {
        iconType: "info",
        bgColor: "bg-stone-50",
        textColor: "text-stone-800",
        borderColor: "border-stone-100",
        icon: null,
      };

      // バッジに応じたスタイル設定
      if (tx.badges?.includes("期限切れ")) {
        styleConfig = {
          iconType: "clock",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-100",
          icon: null,
        };
      } else if (tx.badges?.includes("特典")) {
        styleConfig = {
          iconType: "gift",
          bgColor: "bg-amber-50",
          textColor: "text-amber-600",
          borderColor: "border-amber-100",
          icon: null,
        };
      } else {
        // トランザクションタイプに基づいたスタイル設定
        switch (tx.type) {
          case "payment":
            styleConfig = {
              iconType: "arrow-up",
              bgColor: "bg-stone-50",
              textColor: "text-stone-800",
              borderColor: "border-stone-100",
              icon: null,
            };
            break;
          case "charge":
            styleConfig = {
              iconType: "arrow-down",
              bgColor: "bg-green-50",
              textColor: "text-green-600",
              borderColor: "border-green-100",
              icon: null,
            };
            break;
          case "receive":
            styleConfig = {
              iconType: "arrow-down",
              bgColor: "bg-blue-50",
              textColor: "text-blue-600",
              borderColor: "border-blue-100",
              icon: null,
            };
            break;
          case "expired":
            styleConfig = {
              iconType: "clock",
              bgColor: "bg-red-50",
              textColor: "text-red-600",
              borderColor: "border-red-100",
              icon: null,
            };
            break;
          case "donation":
            styleConfig = {
              iconType: "leaf",
              bgColor: "bg-teal-50",
              textColor: "text-teal-600",
              borderColor: "border-teal-100",
              icon: null,
            };
            break;
        }
      }

      // 金額フォーマット
      const formattedAmount = new Intl.NumberFormat("ja-JP", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(tx.amount);

      const prefix = tx.amount > 0 ? "+" : "";

      return {
        transaction: tx,
        style: styleConfig,
        formattedAmount: `${prefix}${formattedAmount}`,
      };
    });
  }, [transactions]);

  // スタイリング済みのトランザクションデータをプレゼンテーションコンポーネントに渡す
  return (
    <RecentTransactionsList
      transactions={styledTransactions}
      showHeader={showHeader}
    />
  );
}
