"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Transaction,
  TransactionStyle,
  ReceiptItem,
} from "@/features/transactions";
import TransactionHeader from "./TransactionHeader";
import TransactionInfo from "./TransactionInfo";
import TransactionEcoInfo from "./TransactionEcoInfo";
import ActionButtons from "./ActionButtons";
import ReceiptDialog from "./ReceiptDialog";

interface TransactionDetailViewProps {
  transaction: Transaction | null;
  loading: boolean;
  showReceipt: boolean;
  setShowReceipt: (show: boolean) => void;
  style?: TransactionStyle;
  formattedAmount: string;
  forestArea: number;
  co2Reduction: number;
  receiptItems: ReceiptItem[];
  transactionId: string;
  onBackToHistory: () => void;
  onShowEcoImpactDetails: () => void;
  onDownloadReceipt: () => void;
  onShareReceipt: () => void;
}

// プレゼンテーションコンポーネント：取引詳細の表示を担当
const TransactionDetailView = React.memo(
  ({
    transaction,
    loading,
    showReceipt,
    setShowReceipt,
    style,
    formattedAmount,
    forestArea,
    co2Reduction,
    receiptItems,
    transactionId,
    onBackToHistory,
    onShowEcoImpactDetails,
    onDownloadReceipt,
    onShareReceipt,
  }: TransactionDetailViewProps) => {
    // ローディング中表示
    if (loading) {
      return (
        <PageContainer title="取引詳細" activeTab="history">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-700"></div>
          </div>
        </PageContainer>
      );
    }

    // トランザクションが見つからなかった場合
    if (!transaction) {
      return (
        <PageContainer title="取引詳細" activeTab="history">
          <div className="text-center py-8">
            <h2 className="text-lg font-medium text-stone-800">
              取引が見つかりませんでした
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              この取引は削除されたか、存在しません。
            </p>
            <Button
              className="mt-4 bg-teal-700 hover:bg-teal-800 text-white"
              onClick={onBackToHistory}
            >
              取引履歴に戻る
            </Button>
          </div>
        </PageContainer>
      );
    }

    const { type, description, date, badges } = transaction;

    return (
      <PageContainer title="取引詳細" activeTab="history">
        <TransactionHeader
          description={description}
          date={date}
          badges={badges}
          ecoEnabled={transaction.ecoContribution?.enabled}
          style={style}
          onBack={onBackToHistory}
        />

        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="p-6">
            <TransactionInfo
              transactionId={transactionId}
              type={type}
              date={date}
              badges={badges}
              ecoContribution={transaction.ecoContribution}
              formattedAmount={formattedAmount}
              textColor={style?.textColor || "text-stone-800"}
            />

            <ActionButtons
              onShowReceipt={() => setShowReceipt(true)}
              onShare={onShareReceipt}
            />
          </div>
        </Card>

        {/* 環境情報（該当する場合） */}
        {transaction.ecoContribution?.enabled && (
          <TransactionEcoInfo
            forestArea={forestArea}
            co2Reduction={co2Reduction}
            onViewDetails={onShowEcoImpactDetails}
          />
        )}

        {/* 電子レシートダイアログ */}
        <ReceiptDialog
          open={showReceipt}
          onOpenChange={setShowReceipt}
          transactionId={transactionId}
          date={transaction.date}
          items={receiptItems}
          total={Math.abs(transaction.amount)}
          ecoContribution={transaction.ecoContribution}
          receiptSavings={{
            paperSaved: "約5g",
            co2Reduction: "約10g",
          }}
          onDownload={onDownloadReceipt}
          onShare={onShareReceipt}
        />
      </PageContainer>
    );
  },
);

TransactionDetailView.displayName = "TransactionDetailView";

export default TransactionDetailView;
