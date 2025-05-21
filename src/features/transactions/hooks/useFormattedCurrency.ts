/**
 * 金額を通貨形式にフォーマットするためのカスタムフック
 */
export function useFormattedCurrency(
  amount: number,
  options: {
    withPlus?: boolean;
    withSymbol?: boolean;
    locale?: string;
    currency?: string;
  } = {},
): string {
  // デフォルトオプションの設定
  const {
    withPlus = false,
    withSymbol = true,
    locale = "ja-JP",
    currency = "JPY",
  } = options;

  // 金額の符号を決定
  const prefix = amount > 0 && withPlus ? "+" : "";

  // 通貨フォーマットを使用
  const formatter = new Intl.NumberFormat(locale, {
    style: withSymbol ? "currency" : "decimal",
    currency: withSymbol ? currency : undefined,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // フォーマット済みの金額を返す
  return `${prefix}${formatter.format(Math.abs(amount))}`;
}
