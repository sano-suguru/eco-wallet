/**
 * 共通のフォーマット関連ユーティリティ関数
 */

/**
 * 金額を日本円形式でフォーマットする
 * @param amount 金額
 * @param options フォーマットオプション
 * @returns フォーマットされた金額文字列
 */
export function formatCurrency(
  amount: number,
  options?: {
    withSymbol?: boolean;
    withPlus?: boolean;
    compactDisplay?: boolean;
  },
): string {
  const {
    withSymbol = true,
    withPlus = false,
    compactDisplay = false,
  } = options || {};

  const formatter = new Intl.NumberFormat("ja-JP", {
    style: withSymbol ? "currency" : "decimal",
    currency: "JPY",
    currencyDisplay: "symbol",
    notation: compactDisplay ? "compact" : "standard",
  });

  const formatted = formatter.format(Math.abs(amount));
  const prefix = amount < 0 ? "-" : withPlus ? "+" : "";

  return `${prefix}${formatted}`;
}

/**
 * 日付を日本形式でフォーマットする
 * @param date 日付文字列または日付オブジェクト
 * @param includeTime 時間を含めるかどうか
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: string | Date, includeTime = false): string {
  const dateObj =
    typeof date === "string" ? new Date(date.replace(/\//g, "-")) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("ja-JP", options)
    .format(dateObj)
    .replace(/\//g, "/");
}

/**
 * 日付の差分を計算する (残り日数など)
 * @param endDate 終了日
 * @param startDate 開始日 (デフォルトは現在)
 * @returns 日数の差分
 */
export function calculateDateDifference(
  endDate: string | Date,
  startDate?: string | Date,
): number {
  const end =
    typeof endDate === "string"
      ? new Date(endDate.replace(/\//g, "-"))
      : endDate;
  const start = startDate
    ? typeof startDate === "string"
      ? new Date(startDate.replace(/\//g, "-"))
      : startDate
    : new Date();

  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
