"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTransactionStore } from "@/stores/slices/transaction";
import { useEcoImpactStore } from "@/stores/slices/ecoImpact";
import { useFormattedCurrency, useTransactionStyling } from "@/hooks";
import { Transaction } from "@/lib/mock-data/transactions";
import TransactionDetailView from "./TransactionDetailView";

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  isEco: boolean;
}

export interface ReceiptSavings {
  paperSaved: string;
  co2Reduction: string;
}

export default function TransactionDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  // トランザクションストアから取引データを取得
  const getTransactionById = useTransactionStore(
    (state) => state.getTransactionById,
  );

  // 状態管理
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  // 環境貢献データを取得
  const forestArea = useEcoImpactStore((state) => state.forestArea);
  const co2Reduction = useEcoImpactStore((state) => state.co2Reduction);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 実際のAPIリクエストの代わりにモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延を追加

        const data = getTransactionById(transactionId);
        if (data) {
          setTransaction(data);
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionId, getTransactionById]);

  // スタイルとフォーマットを設定
  const style = useTransactionStyling(
    transaction?.type || "payment",
    transaction?.badges || [],
  );

  const formattedAmount = useFormattedCurrency(transaction?.amount || 0, {
    withPlus: true,
    withSymbol: false,
  });

  // レシートアイテムの生成
  const getReceiptItems = (): ReceiptItem[] => {
    if (transaction?.type === "payment") {
      return [
        {
          name: transaction.description,
          quantity: 1,
          price: Math.abs(transaction.amount),
          isEco: transaction.badges?.includes("環境貢献") || false,
        },
      ];
    }
    return [];
  };

  // レシート関連のハンドラー
  const handleDownloadReceipt = () => {
    console.log("レシートをダウンロード");
  };

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${transaction?.description || "取引"}のレシート`,
          text: `${transaction?.date || ""}の取引レシート`,
          url: window.location.href,
        })
        .catch((err) => {
          // AbortError (ユーザーによる共有キャンセル) の場合はエラーとして扱わない
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("共有に失敗しました:", err);
          }
        });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => console.log("URLをクリップボードにコピーしました"))
        .catch((err) => console.error("コピーに失敗しました:", err));
    }
  };

  const handleBackToHistory = () => {
    router.push("/history");
  };

  const handleShowEcoImpactDetails = () => {
    router.push("/impact");
  };

  return (
    <TransactionDetailView
      transaction={transaction}
      loading={loading}
      showReceipt={showReceipt}
      setShowReceipt={setShowReceipt}
      style={style}
      formattedAmount={formattedAmount}
      forestArea={forestArea}
      co2Reduction={co2Reduction}
      receiptItems={getReceiptItems()}
      transactionId={transactionId}
      onBackToHistory={handleBackToHistory}
      onShowEcoImpactDetails={handleShowEcoImpactDetails}
      onDownloadReceipt={handleDownloadReceipt}
      onShareReceipt={handleShareReceipt}
    />
  );
}
