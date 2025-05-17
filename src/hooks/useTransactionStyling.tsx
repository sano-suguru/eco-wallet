"use client";

/**
 * トランザクションのスタイリングに関するカスタムフック
 */
import { useMemo } from "react";
import { TransactionType } from "@/lib/utils/transactions/types";
import { ArrowUp, ArrowDown, Leaf, Clock, Gift, Info } from "lucide-react";

/**
 * トランザクションのスタイル情報を提供するカスタムフック
 *
 * @param type トランザクションタイプ
 * @param badges オプションのバッジ配列
 */
export function useTransactionStyling(
  type: TransactionType,
  badges?: string[],
) {
  // スタイル設定の計算
  const styleConfig = useMemo(() => {
    // 期限切れや特典バッジがある場合、優先的に特別スタイルを適用
    if (badges?.includes("期限切れ")) {
      return {
        iconType: "clock",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        borderColor: "border-red-100",
      };
    }

    if (badges?.includes("特典")) {
      return {
        iconType: "gift",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-100",
      };
    }

    // トランザクションタイプに基づいたデフォルトスタイル
    switch (type) {
      case "payment":
        return {
          iconType: "arrow-up",
          bgColor: "bg-stone-50",
          textColor: "text-stone-800",
          borderColor: "border-stone-100",
        };
      case "charge":
        return {
          iconType: "arrow-down",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-100",
        };
      case "receive":
        return {
          iconType: "arrow-down",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          borderColor: "border-blue-100",
        };
      case "expired":
        return {
          iconType: "clock",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-100",
        };
      case "donation":
        return {
          iconType: "leaf",
          bgColor: "bg-teal-50",
          textColor: "text-teal-600",
          borderColor: "border-teal-100",
        };
      default:
        return {
          iconType: "info",
          bgColor: "bg-stone-50",
          textColor: "text-stone-800",
          borderColor: "border-stone-100",
        };
    }
  }, [type, badges]);

  // アイコンの生成
  const icon = useMemo(() => {
    switch (styleConfig.iconType) {
      case "arrow-up":
        return <ArrowUp className="h-5 w-5 text-stone-500" />;
      case "arrow-down":
        if (styleConfig.textColor === "text-green-600") {
          return <ArrowDown className="h-5 w-5 text-green-500" />;
        } else {
          return <ArrowDown className="h-5 w-5 text-blue-500" />;
        }
      case "leaf":
        return <Leaf className="h-5 w-5 text-teal-500" />;
      case "clock":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "gift":
        return <Gift className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-stone-500" />;
    }
  }, [styleConfig.iconType, styleConfig.textColor]);

  return {
    icon,
    iconType: styleConfig.iconType,
    bgColor: styleConfig.bgColor,
    textColor: styleConfig.textColor,
    borderColor: styleConfig.borderColor,
  };
}
