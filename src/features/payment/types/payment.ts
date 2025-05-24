/**
 * 商品情報の型定義
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
  isEcoFriendly?: boolean;
  ecoDescription?: string;
}

/**
 * 支払い方法の型定義
 */
export type PaymentMethod = "wallet" | "card" | "bank";

/**
 * 支払い方法詳細の型定義
 */
export interface PaymentMethodDetail {
  type: PaymentMethod;
  label: string;
  balance?: number;
  isDisabled?: boolean;
  cardLast4?: string;
  cardBrand?: string;
}

/**
 * 決済オプションの型定義
 */
export interface PaymentOptions {
  includeDonation: boolean;
  donationAmount: number;
  disablePaperReceipt: boolean;
  donationDescription?: string;
}

/**
 * 決済情報の型定義
 */
export interface PaymentInfo {
  product: Product;
  subtotal: number;
  donationAmount: number;
  total: number;
  selectedPaymentMethod: PaymentMethod;
  options: PaymentOptions;
}

/**
 * 決済処理の状態
 */
export type PaymentStatus = "idle" | "processing" | "success" | "error";

/**
 * 決済ストアの状態
 */
export interface PaymentStore {
  // 状態
  paymentInfo: PaymentInfo | null;
  paymentStatus: PaymentStatus;
  error: string | null;

  // アクション
  setPaymentInfo: (info: PaymentInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaymentOptions: (options: Partial<PaymentOptions>) => void;
  processPayment: () => Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }>;
  resetPayment: () => void;
}
