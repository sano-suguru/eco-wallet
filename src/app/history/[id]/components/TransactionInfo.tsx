"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { TransactionDetailSection } from "@/features/transactions";
import { Leaf, Gift, Clock } from "lucide-react";
import { TransactionEcoImpact } from "@/features/eco-impact";

interface TransactionInfoProps {
  transactionId: string;
  type: string;
  date: string;
  badges?: string[];
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
  formattedAmount: string;
  textColor: string;
}

// 取引の詳細情報を表示するプレゼンテーションコンポーネント
const TransactionInfo = React.memo(
  ({
    transactionId,
    type,
    date,
    badges = [],
    ecoContribution,
    formattedAmount,
    textColor,
  }: TransactionInfoProps) => {
    // 取引の種類に応じたラベル
    const getTypeLabel = (type: string) => {
      switch (type) {
        case "payment":
          return "支払い";
        case "charge":
          return "チャージ";
        case "receive":
          return "入金";
        case "donation":
          return "寄付";
        case "expired":
          return "期限切れ";
        default:
          return type;
      }
    };

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-stone-600">金額</span>
          <span className={`text-xl font-bold ${textColor}`}>
            {formattedAmount}
          </span>
        </div>

        <Separator className="mb-4" />

        {/* 取引詳細情報 */}
        <div className="space-y-4">
          {/* 取引情報 */}
          <TransactionDetailSection title="取引情報">
            <div className="bg-stone-50 p-3 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">取引ID</span>
                <span className="font-mono text-stone-800">
                  {transactionId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">取引種類</span>
                <span className="text-stone-800">{getTypeLabel(type)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">日時</span>
                <span className="text-stone-800">{date}</span>
              </div>
            </div>
          </TransactionDetailSection>

          {/* 環境貢献情報 */}
          {ecoContribution?.enabled && (
            <TransactionDetailSection
              title="環境貢献"
              icon={<Leaf className="h-4 w-4 text-teal-600" />}
            >
              <TransactionEcoImpact
                contributionAmount={ecoContribution.amount}
                clickable={false}
              />
            </TransactionDetailSection>
          )}

          {/* キャンペーン情報（該当する場合） */}
          {badges?.includes("特典") && (
            <TransactionDetailSection
              title="キャンペーン情報"
              icon={<Gift className="h-4 w-4 text-amber-600" />}
            >
              <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                <div className="flex items-start space-x-3">
                  <Gift className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      特典詳細
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      友達紹介プログラムによるボーナスが付与されました。
                    </p>
                    {type === "receive" && (
                      <div className="mt-2 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-amber-600" />
                        <span className="text-amber-700">
                          有効期限: 2025/04/30まで
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TransactionDetailSection>
          )}
        </div>
      </>
    );
  },
);

TransactionInfo.displayName = "TransactionInfo";

export default TransactionInfo;
