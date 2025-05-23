"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/shared/types/transaction";
import { TransactionStyle, ReceiptItem } from "@/features/transactions";

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
  // サブコンポーネントのレンダリング関数
  renderHeader: (
    transaction: Transaction | null,
    style?: TransactionStyle,
  ) => React.ReactNode;
  renderInfo: (
    transaction: Transaction | null,
    formattedAmount: string,
    style?: TransactionStyle,
  ) => React.ReactNode;
  renderActionButtons: () => React.ReactNode;
  renderEcoInfo: (forestArea: number, co2Reduction: number) => React.ReactNode;
  renderReceiptDialog: () => React.ReactNode;
}

/**
 * トランザクション詳細のビューコンポーネント
 *
 * プレゼンテーションロジックを担当し、UI表示に集中する
 */
export const TransactionDetailView = React.memo(
  ({
    transaction,
    loading,
    style,
    formattedAmount,
    forestArea,
    co2Reduction,
    onBackToHistory,
    // レンダリング関数
    renderHeader,
    renderInfo,
    renderActionButtons,
    renderEcoInfo,
    renderReceiptDialog,
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

    return (
      <PageContainer title="取引詳細" activeTab="history">
        {/* ヘッダー部分 */}
        {renderHeader(transaction, style)}

        {/* メイン情報 */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="p-6">
            {renderInfo(transaction, formattedAmount, style)}
            {renderActionButtons()}
          </div>
        </Card>

        {/* 環境情報（該当する場合） */}
        {transaction.ecoContribution?.enabled &&
          renderEcoInfo(forestArea, co2Reduction)}

        {/* 電子レシートダイアログ */}
        {renderReceiptDialog()}
      </PageContainer>
    );
  },
);

TransactionDetailView.displayName = "TransactionDetailView";
