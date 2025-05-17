"use client";

/**
 * 通貨フォーマット用のカスタムフック
 */
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils/common";

/**
 * 通貨フォーマットに関するカスタムフック
 *
 * @param amount 金額
 * @param options フォーマットオプション
 * @returns フォーマット済み通貨文字列
 */
export function useFormattedCurrency(
  amount: number,
  options?: {
    withSymbol?: boolean;
    withPlus?: boolean;
    compactDisplay?: boolean;
  },
) {
  return useMemo(() => formatCurrency(amount, options), [amount, options]);
}
