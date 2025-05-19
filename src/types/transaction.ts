/**
 * 取引タイプの型定義
 */
export type TransactionType =
  | "payment"
  | "charge"
  | "receive"
  | "donation"
  | "expired";

/**
 * 取引情報の型定義
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  amount: number;
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
  badges?: string[];
}
