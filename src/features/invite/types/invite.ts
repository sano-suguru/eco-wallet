/**
 * 招待機能の型定義
 */

/**
 * 招待データの型
 */
export interface Invitation {
  /** 招待コード */
  code: string;
  /** 招待先のメールアドレス (オプション) */
  email?: string;
  /** 招待状態 */
  status: InviteStatus;
  /** 招待日時 */
  createdAt: string;
  /** 使用日時 (使用された場合) */
  usedAt?: string;
  /** 招待元ユーザーID */
  inviterId: string;
  /** 招待先ユーザーID (招待が承諾された場合) */
  inviteeId?: string;
}

/**
 * 招待状態の型
 */
export type InviteStatus =
  | "pending" // 招待中
  | "registered" // 登録済み
  | "expired" // 期限切れ
  | "cancelled"; // キャンセル

/**
 * 招待共有オプションの型
 */
export interface InviteShareOptions {
  /** 招待メッセージ */
  message: string;
  /** 招待リンク */
  link: string;
  /** リンクの期限日数（デフォルトは7日間） */
  expiryDays?: number;
}
