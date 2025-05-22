/**
 * 設定機能の型定義
 */

/**
 * 設定のタブの種類
 */
export type SettingsTabType =
  | "profile"
  | "security"
  | "payment"
  | "notifications"
  | "eco";

/**
 * ユーザープロフィール情報
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string; // アバター画像URL
  avatarUrl?: string; // 互換性のためのエイリアス
  phoneNumber?: string;
  joinedDate: string;
  birthdate?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  occupation?: string;
  address?: UserAddress;
  ecoRank?: string; // エコランク（エコマイスターなど）
}

/**
 * ユーザーの住所情報
 */
export interface UserAddress {
  postalCode?: string;
  prefecture?: string;
  city?: string;
  streetAddress?: string;
  building?: string;
}

/**
 * セキュリティ設定
 */
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  lastPasswordChange?: string;
  loginNotifications: boolean;
  accountRecoveryEmail?: string;
  securityQuestions?: SecurityQuestion[];
}

/**
 * セキュリティの質問と回答
 */
export interface SecurityQuestion {
  question: string;
  answer: string; // 通常は暗号化されている
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  transactionAlerts: boolean;
  promotions: boolean;
  ecoTips: boolean;
  newsAndUpdates: boolean;
}

/**
 * 決済方法
 */
export interface PaymentMethod {
  id: string;
  type: "bank_account" | "credit_card" | "debit_card" | "e_wallet";
  name: string;
  maskedNumber: string; // 下4桁などマスクされた番号
  isDefault: boolean;
  expiryDate?: string; // カードの有効期限
  bankName?: string; // 銀行名（銀行口座の場合）
}

/**
 * エコ設定
 */
export interface EcoSettings {
  autoRounding: boolean; // 決済金額の端数を自動的に環境保全に寄付
  carbonOffsetPreference: number; // 炭素オフセットの割合（0-100%）
  monthlyDonationEnabled: boolean; // 月額寄付の有効・無効
  monthlyDonationAmount?: number; // 月額寄付金額
  preferredProjects: string[]; // お気に入りの環境プロジェクトID
}
