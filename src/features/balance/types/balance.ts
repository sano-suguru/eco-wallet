/**
 * 残高機能の型定義
 */

/**
 * 残高情報の型
 */
export interface BalanceInfo {
  /** 現在の残高金額 */
  currentBalance: number;

  /** フォーマット済みの残高表示 */
  formattedBalance?: string;

  /** キャンペーンによる残高の合計 */
  campaignTotal: number;

  /** 期限切れ間近の残高があるかどうか */
  hasExpiringBalance: boolean;

  /** 残高履歴 */
  history?: BalanceHistoryItem[];

  /** 最終更新日時 */
  lastUpdated?: string;
}

/**
 * 残高履歴項目の型
 */
export interface BalanceHistoryItem {
  /** 項目ID */
  id: string;

  /** 日時 */
  timestamp: string;

  /** 金額（正: 入金、負: 出金） */
  amount: number;

  /** 残高タイプ（通常/キャンペーン） */
  type: "regular" | "campaign";

  /** キャンペーンID（キャンペーン残高の場合） */
  campaignId?: string;

  /** 有効期限（キャンペーン残高の場合） */
  expiryDate?: string;

  /** 関連取引ID */
  transactionId?: string;

  /** 説明 */
  description?: string;
}

/**
 * キャンペーン残高の型
 */
export interface CampaignBalance {
  /** キャンペーンID */
  campaignId: string;

  /** キャンペーン名 */
  campaignName: string;

  /** 金額 */
  amount: number;

  /** 有効期限 */
  expiryDate: string;

  /** 期限切れまでの残り日数 */
  daysRemaining: number;

  /** 使用制限（特定カテゴリでのみ使用可能など） */
  restrictions?: string[];
}

/**
 * 残高カードビューのプロパティ型
 */
export interface BalanceCardViewProps {
  /** フォーマット済みの残高 */
  formattedBalance: string;

  /** キャンペーン残高の合計 */
  campaignTotal: number;

  /** 期限切れ間近の残高があるかどうか */
  hasExpiringBalance: boolean;
}

/**
 * 残高カードコンテナのプロパティ型
 */
export interface BalanceCardContainerProps {
  /** カスタムCSSクラス */
  className?: string;
}
