"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, Leaf, ChevronRight } from "lucide-react";
import { Transaction } from "@/shared/types/transaction";
import { TransactionStyle } from "../../hooks/transactionStyling";

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

  // 金額の色を決定
  const getAmountColorClass = () => {
    if (transaction.amount < 0) {
      return "text-stone-700";
    }
    if (
      transaction.type === "receive" ||
      transaction.badges?.includes("特典")
    ) {
      return "text-amber-600";
    }
    return "text-blue-600";
  };

  return (
    <Link href={`/history/${transaction.id}`} className="block group">
      <div className="bg-white rounded-lg border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all duration-200 p-4">
        <div className="flex items-center justify-between">
          {/* 左側：アイコンと情報 */}
          <div className="flex items-center space-x-3 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bgColor} transition-transform duration-200 group-hover:scale-105`}
            >
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-stone-900 truncate">
                {transaction.description}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-stone-500">{transaction.date}</p>

                {/* バッジ表示 */}
                {transaction.ecoContribution?.enabled && (
                  <Badge className="bg-teal-50 text-teal-700 text-[10px] px-1.5 py-0 h-4 rounded-full border-0 hover:bg-teal-100">
                    <Leaf className="h-2.5 w-2.5 mr-0.5" />
                    環境
                  </Badge>
                )}
                {transaction.badges?.map((badge, index) => (
                  <Badge
                    key={index}
                    className={`${
                      badge === "特典"
                        ? "bg-amber-50 text-amber-700"
                        : badge === "期限切れ"
                          ? "bg-red-50 text-red-700"
                          : badge === "割り勘"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-stone-50 text-stone-600"
                    } text-[10px] px-1.5 py-0 h-4 rounded-full border-0`}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：金額と矢印 */}
          <div className="flex items-center gap-2">
            <div className={`text-right ${getAmountColorClass()}`}>
              <p className="text-sm font-semibold">{formattedAmount}</p>
              {transaction.ecoContribution?.enabled && (
                <p className="text-[10px] text-teal-600 mt-0.5">
                  環境貢献 ¥{transaction.ecoContribution.amount}
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
          </div>
        </div>

        {/* キャンペーン特典の詳細表示 */}
        {transaction.type === "receive" &&
          transaction.badges?.includes("特典") && (
            <div className="mt-3 ml-[52px] bg-amber-50 rounded-md p-2.5 border border-amber-200">
              <div className="flex items-center text-amber-700">
                <Gift className="h-3 w-3 mr-1.5" />
                <span className="text-xs font-medium">友達紹介プログラム</span>
              </div>
              <div className="flex items-center mt-1 text-amber-600">
                <Clock className="h-3 w-3 mr-1.5" />
                <span className="text-[11px]">有効期限: 2025/04/30</span>
              </div>
            </div>
          )}

        {/* 期限切れの詳細表示 */}
        {transaction.type === "expired" && (
          <div className="mt-3 ml-[52px] bg-red-50 rounded-md p-2.5 border border-red-200">
            <div className="flex items-center text-red-700">
              <Clock className="h-3 w-3 mr-1.5" />
              <span className="text-xs">
                エコポイントの残高が期限切れになりました
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
});

TransactionItem.displayName = "TransactionItem";

export default TransactionItem;
