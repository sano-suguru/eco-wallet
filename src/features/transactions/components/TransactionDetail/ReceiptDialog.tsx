"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Leaf } from "lucide-react";
import { ReceiptItem } from "@/features/transactions/types/receipt";

// Define EcoContribution locally until it's available in the exported types
interface EcoContribution {
  enabled: boolean;
  amount: number;
}

interface ReceiptSavings {
  paperSaved: string;
  co2Reduction: string;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  date: string;
  items: ReceiptItem[];
  total: number;
  ecoContribution?: EcoContribution;
  receiptSavings: ReceiptSavings;
  onDownload: () => void;
  onShare: () => void;
}

export const ReceiptDialog = React.memo(
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
        <DialogContent className="sm:max-w-md p-0 bg-white overflow-hidden">
          <div className="p-4 bg-white">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-800">
                  電子レシート
                </h3>
                <p className="text-sm text-stone-600">{date}</p>
              </div>
              <div className="text-xs text-right text-stone-500">
                <div>取引 ID:</div>
                <div className="font-mono">{transactionId}</div>
              </div>
            </div>

            <div className="border-t border-b border-stone-200 py-3 my-3">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {item.isEco && (
                        <Leaf className="h-3 w-3 text-emerald-600 mr-1" />
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-stone-500">
                        {item.quantity} × ¥
                        {(item.price / item.quantity).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    ¥{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-1">
              <div className="text-sm text-stone-600">小計</div>
              <div className="text-sm font-medium">
                ¥{total.toLocaleString()}
              </div>
            </div>

            {ecoContribution?.enabled && (
              <div className="flex justify-between text-xs bg-emerald-50 p-2 rounded-md mb-3">
                <div className="text-emerald-700 flex items-center">
                  <Leaf className="h-3 w-3 mr-1" />
                  環境貢献
                </div>
                <div className="text-emerald-700 font-medium">
                  ¥{ecoContribution.amount.toLocaleString()}
                </div>
              </div>
            )}

            <div className="flex justify-between mb-4">
              <div className="text-base font-medium text-stone-800">合計</div>
              <div className="text-base font-bold">
                ¥{total.toLocaleString()}
              </div>
            </div>

            <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-md mb-4">
              <div className="flex justify-between mb-1">
                <div>紙の節約:</div>
                <div>{receiptSavings.paperSaved}</div>
              </div>
              <div className="flex justify-between">
                <div>CO₂削減:</div>
                <div>{receiptSavings.co2Reduction}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-stone-200 hover:bg-stone-50"
                onClick={onDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                保存
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-stone-200 hover:bg-stone-50"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                共有
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ReceiptDialog.displayName = "ReceiptDialog";
