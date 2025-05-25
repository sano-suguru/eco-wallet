/**
 * QRコード関連の型定義
 */

// QRコードのタイプ
export type QRCodeType = "payment" | "transfer" | "invitation" | "general";

// QRコードの内容
export interface QRCodeContent {
  type: QRCodeType;
  data: string;
  securityCode?: string;
  expiresAt?: Date;
}

// QRコード生成オプション
export interface QRCodeGeneratorOptions {
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}

// QRコード支払い情報
export interface QRCodePaymentData {
  securityCode: string;
  amount?: number;
  merchantId?: string;
  orderId?: string;
  timestamp: Date;
}

// QRコードスキャン結果
export interface QRCodeScanResult {
  success: boolean;
  data?: string;
  error?: string;
  timestamp: Date;
}

// QRコードの状態
export interface QRCodeState {
  isGenerating: boolean;
  isScanning: boolean;
  currentCode?: QRCodeContent;
  timeLeft?: number;
  error?: string;
}

// バーコード情報
export interface BarcodeData {
  type: "CODE128" | "EAN13" | "UPC";
  value: string;
  displayValue: string;
}

// QRコード履歴
export interface QRCodeHistory {
  id: string;
  type: QRCodeType;
  data: string;
  createdAt: Date;
  usedAt?: Date;
  status: "active" | "used" | "expired";
}
