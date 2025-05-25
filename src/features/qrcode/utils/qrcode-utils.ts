/**
 * QRコード関連のユーティリティ関数
 */

import { QRCodeContent, QRCodeType } from "../types/qrcode";

/**
 * ランダムなセキュリティコードを生成
 * @param length コードの長さ（デフォルト: 6）
 * @returns 生成されたセキュリティコード
 */
export const generateSecurityCode = (length: number = 6): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * QRコードのURLを生成
 * @param type QRコードのタイプ
 * @param data データ
 * @returns QRコード用のURL
 */
export const generateQRCodeUrl = (type: QRCodeType, data: string): string => {
  switch (type) {
    case "payment":
      return `ecowallet://payment/${data}`;
    case "transfer":
      return `ecowallet://transfer/${data}`;
    case "invitation":
      return `ecowallet://invite/${data}`;
    default:
      return data;
  }
};

/**
 * QRコードコンテンツを生成
 * @param type QRコードのタイプ
 * @param data データ
 * @param expirationMinutes 有効期限（分）
 * @returns QRコードコンテンツ
 */
export const createQRCodeContent = (
  type: QRCodeType,
  data: string,
  expirationMinutes: number = 4,
): QRCodeContent => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

  const securityCode = type === "payment" ? generateSecurityCode() : undefined;

  return {
    type,
    data: generateQRCodeUrl(type, securityCode || data),
    securityCode,
    expiresAt,
  };
};

/**
 * 残り時間をフォーマット
 * @param seconds 秒数
 * @returns フォーマットされた時間（例: "3:45"）
 */
export const formatTimeLeft = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * QRコードの有効期限をチェック
 * @param expiresAt 有効期限
 * @returns 有効かどうか
 */
export const isQRCodeValid = (expiresAt?: Date): boolean => {
  if (!expiresAt) return true;
  return new Date() < expiresAt;
};

/**
 * QRコードのデータをパース
 * @param qrData QRコードのデータ
 * @returns パースされたデータ
 */
export const parseQRCodeData = (
  qrData: string,
): {
  protocol?: string;
  type?: string;
  data?: string;
} => {
  const match = qrData.match(/^(\w+):\/\/(\w+)\/(.+)$/);
  if (match) {
    return {
      protocol: match[1],
      type: match[2],
      data: match[3],
    };
  }
  return { data: qrData };
};

/**
 * バーコード番号を生成
 * @param prefix プレフィックス
 * @returns バーコード番号
 */
export const generateBarcodeNumber = (prefix: string = "8945"): string => {
  const randomPart = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
  return `${prefix} ${randomPart.slice(0, 4)} ${randomPart.slice(
    4,
    8,
  )} ${randomPart.slice(8, 12)}`;
};

/**
 * QRコードエラーメッセージ
 */
export const QR_CODE_ERRORS = {
  CAMERA_NOT_AVAILABLE: "カメラが利用できません",
  PERMISSION_DENIED: "カメラの使用許可が必要です",
  SCAN_FAILED: "QRコードの読み取りに失敗しました",
  INVALID_FORMAT: "無効なQRコード形式です",
  EXPIRED: "QRコードの有効期限が切れています",
  GENERATION_FAILED: "QRコードの生成に失敗しました",
} as const;

/**
 * QRコードの有効期限（秒）
 */
export const QR_CODE_EXPIRATION = {
  PAYMENT: 240, // 4分
  TRANSFER: 600, // 10分
  INVITATION: 86400, // 24時間
  GENERAL: 3600, // 1時間
} as const;
