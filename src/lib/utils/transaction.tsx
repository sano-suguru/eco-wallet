import { TransactionType } from "@/lib/mock-data/transactions";
import { ArrowUp, ArrowDown, Leaf, Clock, Gift, Info } from "lucide-react";

/**
 * トランザクションタイプに基づいたスタイルとアイコンを取得する
 * @param type トランザクションタイプ
 * @param badges オプションのバッジ配列
 * @returns スタイル設定オブジェクト
 */
export function getTransactionStyle(type: TransactionType, badges?: string[]) {
  // 期限切れや特典バッジがある場合、優先的に特別スタイルを適用
  if (badges?.includes("期限切れ")) {
    return {
      icon: <Clock className="h-5 w-5 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-100",
    };
  }

  if (badges?.includes("特典")) {
    return {
      icon: <Gift className="h-5 w-5 text-amber-500" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
    };
  }

  // トランザクションタイプに基づいたデフォルトスタイル
  switch (type) {
    case "payment":
      return {
        icon: <ArrowUp className="h-5 w-5 text-stone-500" />,
        bgColor: "bg-stone-50",
        textColor: "text-stone-800",
        borderColor: "border-stone-100",
      };
    case "charge":
      return {
        icon: <ArrowDown className="h-5 w-5 text-green-500" />,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        borderColor: "border-green-100",
      };
    case "receive":
      return {
        icon: <ArrowDown className="h-5 w-5 text-blue-500" />,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-100",
      };
    case "expired":
      return {
        icon: <Clock className="h-5 w-5 text-red-500" />,
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        borderColor: "border-red-100",
      };
    case "donation":
      return {
        icon: <Leaf className="h-5 w-5 text-teal-500" />,
        bgColor: "bg-teal-50",
        textColor: "text-teal-600",
        borderColor: "border-teal-100",
      };
    default:
      return {
        icon: <Info className="h-5 w-5 text-stone-500" />,
        bgColor: "bg-stone-50",
        textColor: "text-stone-800",
        borderColor: "border-stone-100",
      };
  }
}

/**
 * 環境貢献インパクトを計算する
 * @param amount 金額
 * @returns 環境貢献データ
 */
export function calculateEcoImpact(amount: number) {
  return {
    forestArea: Number((amount * 0.0005).toFixed(2)), // 1000円で0.5m²
    waterSaved: Math.round(amount * 0.25), // 1000円で250L
    co2Reduction: Number((amount * 0.0125).toFixed(1)), // 1000円で12.5kg
  };
}
