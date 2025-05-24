"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEcoImpactStore } from "@/stores/slices/ecoImpact";
import {
  ReceiptItem,
  useTransactionStore,
  getTransactionStyle,
} from "@/features/transactions";
import { Transaction } from "@/shared/types/transaction";
import { useFormattedCurrency } from "@/shared/hooks/useFormattedCurrency";
import { TransactionDetailView } from "./TransactionDetailView";
import { TransactionHeader } from "./TransactionHeader";
import { TransactionInfo } from "./TransactionInfo";
import { TransactionEcoInfo } from "./TransactionEcoInfo";
import { ActionButtons } from "./ActionButtons";
import { ReceiptDialog } from "./ReceiptDialog";

/**
 * トランザクション詳細のコンテナコンポーネント
 *
 * データの取得や状態管理、ビジネスロジックの処理を担当
 */
export function TransactionDetailContainer() {
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
  const style = getTransactionStyle(
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

  // イベントハンドラー
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
          // ユーザーがキャンセルした場合は何もしない（正常な動作）
          if (err.name === "AbortError" || err.message === "Share canceled") {
            return;
          }
          // その他のエラーの場合のみログ出力
          console.error("共有に失敗しました:", err);
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

  // サブコンポーネントのレンダリング関数
  const renderHeader = (
    transaction: Transaction | null,
    style?: ReturnType<typeof getTransactionStyle>,
  ) => {
    if (!transaction) return null;
    return (
      <TransactionHeader
        description={transaction.description}
        date={transaction.date}
        badges={transaction.badges}
        ecoEnabled={transaction.ecoContribution?.enabled}
        style={style}
        onBack={handleBackToHistory}
      />
    );
  };

  const renderInfo = (
    transaction: Transaction | null,
    formattedAmount: string,
    style?: ReturnType<typeof getTransactionStyle>,
  ) => {
    if (!transaction) return null;
    return (
      <TransactionInfo
        transactionId={transactionId}
        type={transaction.type}
        date={transaction.date}
        badges={transaction.badges}
        ecoContribution={transaction.ecoContribution}
        formattedAmount={formattedAmount}
        textColor={style?.textColor || "text-stone-800"}
      />
    );
  };

  const renderActionButtons = () => {
    return (
      <ActionButtons
        onShowReceipt={() => setShowReceipt(true)}
        onShare={handleShareReceipt}
      />
    );
  };

  const renderEcoInfo = (forestArea: number, co2Reduction: number) => {
    return (
      <TransactionEcoInfo
        forestArea={forestArea}
        co2Reduction={co2Reduction}
        onViewDetails={handleShowEcoImpactDetails}
      />
    );
  };

  const renderReceiptDialog = () => {
    if (!transaction) return null;
    return (
      <ReceiptDialog
        open={showReceipt}
        onOpenChange={setShowReceipt}
        transactionId={transactionId}
        date={transaction.date}
        items={getReceiptItems()}
        total={Math.abs(transaction.amount)}
        ecoContribution={transaction.ecoContribution}
        receiptSavings={{
          paperSaved: "約5g",
          co2Reduction: "約10g",
        }}
        onDownload={handleDownloadReceipt}
        onShare={handleShareReceipt}
      />
    );
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
      // レンダリング関数
      renderHeader={renderHeader}
      renderInfo={renderInfo}
      renderActionButtons={renderActionButtons}
      renderEcoInfo={renderEcoInfo}
      renderReceiptDialog={renderReceiptDialog}
    />
  );
}
