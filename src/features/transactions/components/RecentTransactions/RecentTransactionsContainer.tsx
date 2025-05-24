"use client";

import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/shared/types/transaction";
import { useTransactionStore } from "@/stores/slices/transaction";
import {
  getTransactionStyle,
  TransactionStyle,
} from "../../hooks/transactionStyling";
import { StyledTransaction } from "../TransactionItem";
import RecentTransactionsList from "./RecentTransactionsList";

interface RecentTransactionsContainerProps {
  limit?: number;
  showHeader?: boolean;
}

// トランザクション金額をフォーマットするヘルパー関数
const formatTransactionAmount = (amount: number): string => {
  const prefix = amount > 0 ? "+" : "";
  return `${prefix}${new Intl.NumberFormat("ja-JP").format(Math.abs(amount))}`;
};

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

  // 各トランザクションタイプのスタイルを事前に計算
  const paymentStyle = getTransactionStyle("payment", []);
  const chargeStyle = getTransactionStyle("charge", []);
  const receiveStyle = getTransactionStyle("receive", []);
  const donationStyle = getTransactionStyle("donation", []);
  const expiredStyle = getTransactionStyle("expired", []);
  const receiveWithBonusStyle = getTransactionStyle("receive", ["特典"]);

  // トランザクションデータをフェッチ
  useEffect(() => {
    const recentTransactions = getRecentTransactions(limit);
    setTransactions(recentTransactions);
  }, [getRecentTransactions, limit]);

  // スタイル適用済みトランザクションを生成（データとスタイルを結合）
  const styledTransactions: StyledTransaction[] = useMemo(() => {
    return transactions.map((tx) => {
      // トランザクションタイプとバッジに基づいてスタイルを取得するヘルパー関数
      let style: TransactionStyle;

      if (tx.type === "receive" && tx.badges?.includes("特典")) {
        style = receiveWithBonusStyle;
      } else {
        switch (tx.type) {
          case "payment":
            style = paymentStyle;
            break;
          case "charge":
            style = chargeStyle;
            break;
          case "receive":
            style = receiveStyle;
            break;
          case "donation":
            style = donationStyle;
            break;
          case "expired":
            style = expiredStyle;
            break;
          default:
            style = paymentStyle;
        }
      }

      const formattedAmount = formatTransactionAmount(tx.amount);

      return {
        transaction: tx,
        style,
        formattedAmount,
      };
    });
  }, [
    transactions,
    paymentStyle,
    chargeStyle,
    receiveStyle,
    donationStyle,
    expiredStyle,
    receiveWithBonusStyle,
  ]);

  // スタイリング済みのトランザクションデータをプレゼンテーションコンポーネントに渡す
  return (
    <RecentTransactionsList
      transactions={styledTransactions}
      showHeader={showHeader}
    />
  );
}
