import { TransactionType } from "@/lib/mock-data/transactions";
import { calculateEcoImpact as newCalculateEcoImpact } from "@/lib/utils/eco-impact";

/**
 * トランザクションタイプに基づいたスタイル設定を取得する(アイコンなし)
 * @param type トランザクションタイプ
 * @param badges オプションのバッジ配列
 * @returns スタイル設定オブジェクト
 */
export function getTransactionStyleConfig(
  type: TransactionType,
  badges?: string[],
) {
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

/**
 * 環境貢献インパクトの計算は eco-impact.ts に移動しました
 * @deprecated eco-impact.ts の calculateEcoImpact を使用してください
 */
export function calculateEcoImpact(amount: number) {
  // 互換性のために残していますが、警告メッセージをコンソールに表示
  console.warn(
    "transaction.tsx の calculateEcoImpact は非推奨です。代わりに eco-impact.ts の同名関数を使用してください。",
  );

  // トップレベルでインポートした関数を使用
  return newCalculateEcoImpact(amount);
}
