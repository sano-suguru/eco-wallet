"use client";

import React from "react";
import { TransactionType } from "@/shared/types/transaction";

// Define EcoContribution locally until it's available in the exported types
interface EcoContribution {
  enabled: boolean;
  amount: number;
}

interface TransactionInfoProps {
  transactionId: string;
  type: TransactionType;
  date: string;
  badges?: string[];
  ecoContribution?: EcoContribution;
  formattedAmount: string;
  textColor: string;
}

export const TransactionInfo = React.memo(
  ({
    transactionId,
    type,
    date,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    badges = [],
    ecoContribution,
    formattedAmount,
    textColor,
  }: TransactionInfoProps) => {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-stone-600">取引番号</p>
            <p className="text-sm font-mono">{transactionId}</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${textColor} text-right`}>
              {formattedAmount}円
            </p>
            {ecoContribution?.enabled && (
              <p className="text-xs text-right text-emerald-600">
                うち環境貢献 {ecoContribution.amount}円
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p className="text-stone-600">取引種別</p>
            <p className="font-medium">
              {{
                payment: "支払い",
                charge: "チャージ",
                transfer: "送金",
                donation: "寄付",
                receive: "受取",
                expired: "期限切れ",
              }[type] || "その他"}
            </p>
          </div>
          <div>
            <p className="text-stone-600">日時</p>
            <p className="font-medium">{date}</p>
          </div>

          {type === "payment" && (
            <>
              <div>
                <p className="text-stone-600">支払方法</p>
                <p className="font-medium">エコウォレット</p>
              </div>
              <div>
                <p className="text-stone-600">ステータス</p>
                <p className="text-emerald-600 font-medium">完了</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

TransactionInfo.displayName = "TransactionInfo";
