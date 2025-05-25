# QRコード機能

QRコードの生成、表示、スキャン機能を提供するfeatureモジュールです。

## 機能概要

- QRコード生成（支払い、送金、招待など）
- バーコード表示
- セキュリティコードの自動生成
- 有効期限管理とタイマー表示
- QRコードスキャン（実装予定）

## ディレクトリ構成

```
features/qrcode/
├── types/              # 型定義
├── components/         # UIコンポーネント
│   ├── QRCodeGenerator/    # QRコード生成コンポーネント
│   ├── QRCodeDisplay/      # QRコード表示コンポーネント
│   ├── BarCodeDisplay/     # バーコード表示コンポーネント
│   ├── QRCodeScanner/      # QRコードスキャナー（実装予定）
│   └── QRCodePage/         # QRコード決済ページ
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ関数
└── data/               # モックデータ（必要に応じて）
```

## 主要コンポーネント

### QRCodeGenerator

- QRコードの生成と表示を行うメインコンポーネント
- セキュリティコード、タイマー、更新機能を含む
- 支払い、送金、招待など複数のタイプに対応

### QRCodeDisplay

- QRコードの表示のみを行うプレゼンテーショナルコンポーネント
- サイズ、色、レベルなどをカスタマイズ可能

### BarCodeDisplay

- バーコードの表示を行うコンポーネント
- 店舗での決済時に使用

### QRCodePage

- QRコード決済画面全体を構成するページコンポーネント
- ヘッダー、QRコード、バーコード、アクションボタンを含む

## 使用例

### 基本的なQRコード生成

```tsx
import { QRCodeGenerator } from "@/features/qrcode";

function PaymentPage() {
  return (
    <QRCodeGenerator
      type="payment"
      showHeader={true}
      showSecurityCode={true}
      showTimer={true}
    />
  );
}
```

### カスタムQRコード表示

```tsx
import { QRCodeDisplay } from "@/features/qrcode";

function CustomQRCode() {
  return (
    <QRCodeDisplay
      value="https://example.com"
      size={250}
      fgColor="#007bff"
      level="M"
    />
  );
}
```

### QRコード生成フックの使用

```tsx
import { useQRCodeGenerator } from "@/features/qrcode";

function CustomComponent() {
  const { qrContent, timeLeft, formattedTimeLeft, isExpired, generateNewCode } =
    useQRCodeGenerator({
      type: "payment",
      autoRefresh: true,
    });

  return (
    <div>
      {qrContent && <QRCodeDisplay value={qrContent.data} />}
      <p>残り時間: {formattedTimeLeft}</p>
      <button onClick={generateNewCode}>更新</button>
    </div>
  );
}
```

## 型定義

### QRCodeType

```typescript
type QRCodeType = "payment" | "transfer" | "invitation" | "general";
```

### QRCodeContent

```typescript
interface QRCodeContent {
  type: QRCodeType;
  data: string;
  securityCode?: string;
  expiresAt?: Date;
}
```

### QRCodeGeneratorOptions

```typescript
interface QRCodeGeneratorOptions {
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}
```

## ユーティリティ関数

- `generateSecurityCode()`: ランダムなセキュリティコードを生成
- `generateQRCodeUrl()`: QRコードのURLを生成
- `formatTimeLeft()`: 残り時間をフォーマット
- `isQRCodeValid()`: QRコードの有効期限をチェック
- `parseQRCodeData()`: QRコードのデータをパース
- `generateBarcodeNumber()`: バーコード番号を生成

## 今後の実装予定

- QRコードスキャナー機能
- スキャン履歴の保存
- オフライン対応
- カメラ権限の管理
- スキャンエラーハンドリングの強化
