import { TransactionType } from "@/lib/mock-data/transactions";
import { ArrowUp, ArrowDown, Leaf, Clock, Gift, Info } from "lucide-react";
import { getTransactionStyleConfig } from "./transaction";

/**
 * トランザクションタイプに基づいたスタイルとアイコンを取得する
 * @param type トランザクションタイプ
 * @param badges オプションのバッジ配列
 * @returns スタイル設定とアイコンを含むオブジェクト
 */
export function getTransactionStyle(type: TransactionType, badges?: string[]) {
  const styleConfig = getTransactionStyleConfig(type, badges);

  // スタイル設定に基づいてアイコンを生成
  let icon;

  switch (styleConfig.iconType) {
    case "arrow-up":
      icon = <ArrowUp className="h-5 w-5 text-stone-500" />;
      break;
    case "arrow-down":
      if (styleConfig.textColor === "text-green-600") {
        icon = <ArrowDown className="h-5 w-5 text-green-500" />;
      } else {
        icon = <ArrowDown className="h-5 w-5 text-blue-500" />;
      }
      break;
    case "leaf":
      icon = <Leaf className="h-5 w-5 text-teal-500" />;
      break;
    case "clock":
      icon = <Clock className="h-5 w-5 text-red-500" />;
      break;
    case "gift":
      icon = <Gift className="h-5 w-5 text-amber-500" />;
      break;
    default:
      icon = <Info className="h-5 w-5 text-stone-500" />;
      break;
  }

  return {
    icon,
    bgColor: styleConfig.bgColor,
    textColor: styleConfig.textColor,
    borderColor: styleConfig.borderColor,
  };
}
