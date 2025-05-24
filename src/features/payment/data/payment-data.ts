import type { Product, PaymentMethodDetail } from "../types/payment";

/**
 * 商品のモックデータ
 */
export const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "エコ製品定期プラン",
    description: "リサイクル素材100%",
    price: 3800,
    isEcoFriendly: true,
    ecoDescription:
      "この商品はリサイクル素材を使用し、製造過程でのCO2排出量を80%削減しています",
  },
  {
    id: "product-2",
    name: "エコバッグセット",
    description: "再生可能素材使用",
    price: 2500,
    isEcoFriendly: true,
    ecoDescription: "持続可能な素材を使用し、プラスチック削減に貢献します",
  },
  {
    id: "product-3",
    name: "リユーザブルボトル",
    description: "BPAフリー・耐久性抜群",
    price: 1800,
    isEcoFriendly: true,
    ecoDescription: "使い捨てプラスチックボトルの削減に貢献します",
  },
];

/**
 * 支払い方法のモックデータ
 */
export const mockPaymentMethods: PaymentMethodDetail[] = [
  {
    type: "wallet",
    label: "Eco Wallet残高",
    balance: 12500,
    isDisabled: false,
  },
  {
    type: "card",
    label: "登録済みカード",
    isDisabled: true,
    cardLast4: "1234",
    cardBrand: "Visa",
  },
  {
    type: "bank",
    label: "銀行振込",
    isDisabled: true,
  },
];

/**
 * デフォルトの決済オプション
 */
export const defaultPaymentOptions = {
  includeDonation: true,
  donationAmount: 200,
  disablePaperReceipt: false,
  donationDescription: "寄付金は山岳地域の清掃活動に使用されます",
};
