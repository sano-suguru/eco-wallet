/**
 * QRコードモジュール
 *
 * QRコードの生成、スキャン、表示機能を提供
 */

// コンポーネント
export { QRCodeDisplay } from "./components/QRCodeDisplay";
export { QRCodeGenerator } from "./components/QRCodeGenerator";
export { QRCodeScanner } from "./components/QRCodeScanner";
export { BarCodeDisplay } from "./components/BarCodeDisplay";
export { QRCodePage } from "./components/QRCodePage";

// フック
export { useQRCodeGenerator } from "./hooks/useQRCodeGenerator";
export { useQRCodeScanner } from "./hooks/useQRCodeScanner";

// 型定義
export type {
  QRCodeType,
  QRCodeContent,
  QRCodeGeneratorOptions,
  QRCodePaymentData,
  QRCodeScanResult,
  QRCodeState,
  BarcodeData,
  QRCodeHistory,
} from "./types/qrcode";

// ユーティリティ
export {
  generateSecurityCode,
  generateQRCodeUrl,
  createQRCodeContent,
  formatTimeLeft,
  isQRCodeValid,
  parseQRCodeData,
  generateBarcodeNumber,
  QR_CODE_ERRORS,
  QR_CODE_EXPIRATION,
} from "./utils/qrcode-utils";
