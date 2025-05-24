# Payment Feature Module

決済機能を提供するfeatureモジュールです。商品情報の表示、支払い方法の選択、決済オプションの管理、決済処理を含みます。

## 構造

```
payment/
├── components/
│   ├── ProductInfo/          # 商品情報表示
│   ├── PaymentSummary/       # 決済サマリー
│   ├── PaymentMethodSelector/# 支払い方法選択
│   └── PaymentOptions/       # 決済オプション（寄付・レシート）
├── types/
│   └── payment.ts           # 型定義
├── store/
│   └── payment.slice.ts     # Zustand状態管理
├── data/
│   └── payment-data.ts      # モックデータ
├── index.ts                 # Public API
└── README.md               # このファイル
```

## 主な型定義

- `Product`: 商品情報
- `PaymentMethod`: 支払い方法（'wallet' | 'card' | 'bank'）
- `PaymentMethodDetail`: 支払い方法の詳細情報
- `PaymentOptions`: 決済オプション（寄付・レシート設定）
- `PaymentInfo`: 決済情報全体
- `PaymentStatus`: 決済処理の状態

## コンポーネント

### ProductInfo

商品情報を表示するコンポーネント。商品名、説明、価格を表示。

### PaymentSummary

決済金額のサマリーを表示。小計、寄付金額、合計を表示。

### PaymentMethodSelector

支払い方法を選択するためのラジオボタングループ。

### PaymentOptions

決済オプション（環境保全寄付、紙レシート無効化）を管理。

## ストア (Zustand)

### usePaymentStore

決済情報と処理状態を管理するZustandストア。

**状態:**

- `paymentInfo`: 決済情報
- `paymentStatus`: 処理状態
- `error`: エラーメッセージ

**アクション:**

- `setPaymentInfo`: 決済情報を設定
- `setPaymentMethod`: 支払い方法を変更
- `setPaymentOptions`: 決済オプションを更新
- `processPayment`: 決済処理を実行
- `resetPayment`: 状態をリセット

## 使用例

```tsx
import {
  usePaymentStore,
  ProductInfo,
  PaymentSummary,
  PaymentMethodSelector,
  PaymentOptionsComponent,
  mockProducts,
  mockPaymentMethods,
  defaultPaymentOptions,
} from "@/features/payment";

function PaymentPage() {
  const {
    paymentInfo,
    paymentStatus,
    setPaymentInfo,
    setPaymentMethod,
    setPaymentOptions,
    processPayment,
  } = usePaymentStore();

  // 初期化
  useEffect(() => {
    setPaymentInfo({
      product: mockProducts[0],
      subtotal: mockProducts[0].price,
      donationAmount: defaultPaymentOptions.donationAmount,
      total: mockProducts[0].price + defaultPaymentOptions.donationAmount,
      selectedPaymentMethod: "wallet",
      options: defaultPaymentOptions,
    });
  }, []);

  const handlePayment = async () => {
    const result = await processPayment();
    if (result.success) {
      router.push(`/history/${result.transactionId}`);
    }
  };

  return (
    <div>
      <ProductInfo product={paymentInfo.product} />
      <PaymentSummary {...paymentInfo} />
      <PaymentMethodSelector
        methods={mockPaymentMethods}
        selectedMethod={paymentInfo.selectedPaymentMethod}
        onMethodChange={setPaymentMethod}
      />
      <PaymentOptionsComponent
        options={paymentInfo.options}
        onOptionsChange={setPaymentOptions}
      />
      <button onClick={handlePayment}>決済を確定する</button>
    </div>
  );
}
```

## トランザクションとの連携

決済が成功すると、自動的にトランザクションストアに新しいトランザクションが追加されます。
環境貢献オプションが有効な場合、トランザクションにエコ貢献情報が含まれます。

## 注意事項

- 現在はモックデータを使用していますが、実際のAPIとの連携時は`processPayment`メソッドを更新する必要があります
- 支払い方法として現在は'wallet'のみが有効になっています
- 決済処理中は他の操作を無効化することを推奨します
