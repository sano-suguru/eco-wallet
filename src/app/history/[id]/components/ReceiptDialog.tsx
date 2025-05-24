"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ElectronicReceipt } from "@/components/receipts/ElectronicReceipt";
import { ReceiptItem, ReceiptSavings } from "@/features/transactions";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  date: string;
  items: ReceiptItem[];
  total: number;
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
  receiptSavings: ReceiptSavings;
  onDownload: () => void;
  onShare: () => void;
}

// 電子レシート表示用のダイアログコンポーネント
const ReceiptDialog = React.memo(
  ({
    open,
    onOpenChange,
    transactionId,
    date,
    items,
    total,
    ecoContribution,
    receiptSavings,
    onDownload,
    onShare,
  }: ReceiptDialogProps) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto p-0">
          <DialogTitle className="sr-only">電子レシート</DialogTitle>
          <ElectronicReceipt
            open={open}
            onOpenChange={onOpenChange}
            transactionId={transactionId}
            date={date}
            items={items}
            total={total}
            ecoContribution={ecoContribution}
            receiptSavings={receiptSavings}
            onDownload={onDownload}
            onShare={onShare}
          />
        </DialogContent>
      </Dialog>
    );
  },
);

ReceiptDialog.displayName = "ReceiptDialog";

export default ReceiptDialog;
