"use client";

import { useState, useEffect, useMemo } from "react";
import { Transaction } from "../../types/transaction";
import { useTransactionStore } from "../../store/transaction.slice";
import {
  useTransactionStyling,
  TransactionStyle,
} from "../../hooks/useTransactionStyling";
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
  const paymentStyle = useTransactionStyling("payment", []);
  const chargeStyle = useTransactionStyling("charge", []);
  const receiveStyle = useTransactionStyling("receive", []);
  const donationStyle = useTransactionStyling("donation", []);
  const expiredStyle = useTransactionStyling("expired", []);
  const receiveWithBonusStyle = useTransactionStyling("receive", ["特典"]);

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
