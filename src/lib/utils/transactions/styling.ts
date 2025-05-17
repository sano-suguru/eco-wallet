/**
 * トランザクションのスタイリングに関する関数
 */
import { TransactionType, TransactionStyleConfig } from "./types";

/**
 * トランザクションタイプに基づいたスタイル設定を取得する(アイコンなし)
 * @param type トランザクションタイプ
 * @param badges オプションのバッジ配列
 * @returns スタイル設定オブジェクト
 */
export function getTransactionStyleConfig(
  type: TransactionType,
  badges?: string[],
): TransactionStyleConfig {
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
}
