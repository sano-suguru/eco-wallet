/**
 * チャージ機能の型定義
 */

/**
 * チャージメソッド（入金方法）の型
 */
export type ChargeMethod =
  | "bank_transfer"
  | "credit_card"
  | "convenience_store"
  | "direct_debit";

/**
 * チャージステップの型
 */
export type ChargeStep = "input" | "confirm" | "complete";

/**
 * チャージデータの型
 */
export interface ChargeData {
  /** チャージ金額 */
  amount: number;
  /** チャージ方法 */
  method: ChargeMethod;
  /** 処理ID */
  processingId?: string;
  /** 処理日時 */
  processedAt?: string;
  /** 手数料 */
  fee?: number;
  /** エコポイントへの変換率 */
  conversionRate?: number;
  /** 獲得エコポイント */
  ecoPoints?: number;
  /** 取引ステータス */
  status?: "pending" | "completed" | "failed";
  /** バンク情報 (銀行振込の場合) */
  bankInfo?: BankTransferInfo;
  /** クレジットカード情報 (カード決済の場合) */
  cardInfo?: CardInfo;
}

/**
 * 銀行振込情報の型
 */
export interface BankTransferInfo {
  /** 銀行名 */
  bankName: string;
  /** 支店名 */
  branchName: string;
  /** 口座種別 */
  accountType: "普通" | "当座";
  /** 口座番号 */
  accountNumber: string;
  /** 口座名義 */
  accountHolder: string;
  /** 振込期限 */
  deadline?: string;
  /** 振込先メモ */
  transferMemo?: string;
}

/**
 * カード情報の型
 */
export interface CardInfo {
  /** カード会社 */
  brand: string;
  /** カード番号(マスクされたもの) */
  maskedNumber: string;
  /** 有効期限 */
  expiryDate: string;
  /** カード名義 */
  holderName?: string;
}
