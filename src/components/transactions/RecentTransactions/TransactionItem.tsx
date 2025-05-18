"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, Leaf } from "lucide-react";
import { CompactEcoImpact } from "@/components/eco/CompactEcoImpact";
import { Transaction } from "@/lib/mock-data/transactions";

// スタイル情報の型定義をエクスポートして再利用可能に
export interface TransactionStyle {
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconType: string;
  icon: React.ReactNode;
}

// スタイル化されたトランザクションの型定義
export interface StyledTransaction {
  transaction: Transaction;
  style: TransactionStyle;
  formattedAmount: string;
}

interface TransactionItemProps {
  item: StyledTransaction;
}

// プレゼンテーションコンポーネント: 単純に個々のトランザクションUIを表示するのみ
const TransactionItem = React.memo(({ item }: TransactionItemProps) => {
  const { transaction, style, formattedAmount } = item;

  return (
    <Link
      href={`/history/${transaction.id}`}
      className="block hover:bg-stone-50 transition-colors"
    >
      <div className="p-3 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bgColor}`}
            >
              {style.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-800">
                {transaction.description}
              </h4>
              <div className="flex items-center">
                <p className="text-xs text-stone-700">{transaction.date}</p>
                {transaction.ecoContribution?.enabled && (
                  <Badge className="ml-2 bg-teal-100 text-teal-600 text-[10px] py-0 h-4 rounded-full border-0">
                    <Leaf className="h-2 w-2 mr-0.5" />
                    環境貢献
                  </Badge>
                )}
                {transaction.badges?.map((badge, index) => (
                  <Badge
                    key={index}
                    className={`ml-2 ${
                      badge === "特典"
                        ? "bg-amber-100 text-amber-600"
                        : badge === "期限切れ"
                          ? "bg-red-100 text-red-600"
                          : "bg-stone-100 text-stone-600"
                    } text-[10px] py-0 h-4 rounded-full border-0`}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`text-sm font-medium ${
              transaction.amount < 0
                ? "text-stone-800"
                : transaction.type === "receive" ||
                    transaction.badges?.includes("特典")
                  ? "text-amber-600"
                  : "text-green-600"
            }`}
          >
            {formattedAmount}
          </div>
        </div>

        {/* 環境貢献表示 */}
        {transaction.ecoContribution?.enabled && (
          <div className="mt-2 ml-11">
            <CompactEcoImpact
              contributionAmount={transaction.ecoContribution.amount}
              disableLink={true}
            />
          </div>
        )}

        {/* キャンペーン特典の表示 */}
        {transaction.type === "receive" &&
          transaction.badges?.includes("特典") && (
            <div className="mt-2 ml-11 text-xs bg-amber-100 rounded-lg p-2 border border-amber-600/20">
              <div className="flex items-center text-amber-600">
                <Gift className="h-3 w-3 mr-1" />
                <span className="font-medium">友達紹介プログラム</span>
              </div>
              <div className="flex items-center mt-1 text-amber-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>有効期限: 2025/04/30</span>
              </div>
            </div>
          )}

        {/* 期限切れの表示 */}
        {transaction.type === "expired" && (
          <div className="mt-2 ml-11 text-xs bg-red-100 rounded-lg p-2 border border-red-600/20">
            <div className="flex items-center text-red-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>エコポイントの残高が期限切れになりました</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
});

TransactionItem.displayName = "TransactionItem";

export default TransactionItem;
