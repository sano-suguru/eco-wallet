import React from "react";
import {
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  HeartHandshake,
  Clock,
} from "lucide-react";
import { TransactionType } from "../types/transaction";

// トランザクションスタイルの型定義
export interface TransactionStyle {
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconType: string;
  icon: React.ReactNode;
}

/**
 * トランザクションのタイプとバッジに基づいてスタイルを生成するカスタムフック
 */
export function useTransactionStyling(
  type: TransactionType,
  badges: string[] = [],
): TransactionStyle {
  // トランザクションタイプに応じたスタイルを設定
  switch (type) {
    case "payment":
      return {
        bgColor: "bg-stone-100",
        textColor: "text-stone-600",
        borderColor: "border-stone-200",
        iconType: "payment",
        icon: <ArrowUp className="h-5 w-5 text-stone-600" />,
      };
    case "charge":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200",
        iconType: "charge",
        icon: <CircleDollarSign className="h-5 w-5 text-green-600" />,
      };
    case "receive":
      // 特典バッジがある場合は特別なスタイル
      if (badges.includes("特典")) {
        return {
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
          borderColor: "border-amber-200",
          iconType: "bonus",
          icon: <ArrowDown className="h-5 w-5 text-amber-600" />,
        };
      }
      return {
        bgColor: "bg-sky-100",
        textColor: "text-sky-600",
        borderColor: "border-sky-200",
        iconType: "receive",
        icon: <ArrowDown className="h-5 w-5 text-sky-600" />,
      };
    case "donation":
      return {
        bgColor: "bg-teal-100",
        textColor: "text-teal-600",
        borderColor: "border-teal-200",
        iconType: "donation",
        icon: <HeartHandshake className="h-5 w-5 text-teal-600" />,
      };
    case "expired":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        borderColor: "border-red-200",
        iconType: "expired",
        icon: <Clock className="h-5 w-5 text-red-600" />,
      };
    default:
      // デフォルトスタイル
      return {
        bgColor: "bg-stone-100",
        textColor: "text-stone-600",
        borderColor: "border-stone-200",
        iconType: "default",
        icon: <CircleDollarSign className="h-5 w-5 text-stone-600" />,
      };
  }
}
