/**
 * トランザクション関連の型定義
 */
import React from "react";

/**
 * トランザクションタイプの定義
 */
export type TransactionType =
  | "payment"
  | "charge"
  | "receive"
  | "donation"
  | "expired";

/**
 * トランザクションインターフェース
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

/**
 * トランザクションのスタイル設定インターフェース
 */
export interface TransactionStyleConfig {
  iconType: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

/**
 * トランザクションスタイル（アイコン含む）インターフェース
 */
export interface TransactionStyle {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  borderColor: string;
}
