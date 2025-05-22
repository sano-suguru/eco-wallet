# チャージ機能（Charge Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいたチャージ機能を含みます。

## ディレクトリ構造

```
charge/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── BankTransferSection/    # 銀行振込セクション
│   └── ChargeInput/            # チャージ入力関連コンポーネント
│       ├── AmountInput.tsx     # 金額入力コンポーネント
│       ├── BankTransferInput.tsx # 銀行振込入力コンポーネント
│       ├── ChargeInputContainer.tsx # コンテナコンポーネント
│       ├── ChargeInputForm.tsx # フォーム表示コンポーネント
│       └── index.ts           # 公開API
├── types/                      # 型定義
│   └── charge.ts               # チャージ関連の型定義
├── utils/                      # ユーティリティ関数（将来的に追加予定）
├── store/                      # 状態管理（将来的に追加予定）
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // 型定義
  ChargeMethod,
  ChargeStep,
  ChargeData,

  // コンポーネント
  ChargeInputContainer,
  BankTransferSection,

  // コンポーネントプロパティ型
  ChargeInputContainerProps,
  BankTransferSectionProps,
} from "@/features/charge";
```

### コンポーネント例

#### チャージ入力コンテナ

```tsx
<ChargeInputContainer onProceedToConfirm={(amount) => handleConfirm(amount)} />
```

#### 銀行振込セクション

```tsx
<BankTransferSection
  email={userEmail}
  setEmail={setUserEmail}
  amount={chargeAmount}
  setAmount={setChargeAmount}
  emailSent={isEmailSent}
  setEmailSent={setIsEmailSent}
  isLoading={loading}
  isValidEmail={validEmail}
  isValidAmount={validAmount}
  error={errorMessage}
  handleSelectAmount={handleAmountSelection}
  handleSendBankTransferEmail={sendBankTransferEmail}
  transferCode={code}
  setTransferCode={setCode}
  processingVerification={verifying}
  handleNotifyBankTransfer={notifyTransfer}
/>
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. チャージ金額入力フォームの提供
2. 銀行振込プロセスの管理
3. チャージ金額のバリデーション
4. チャージ確認および完了フローの制御

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 共通ユーティリティ: `@/lib/utils/validation`
- アイコン: `lucide-react`

## 拡張予定

今後、以下の機能を追加予定です：

1. チャージ履歴の管理機能
2. 定期チャージ機能
3. クレジットカード決済の詳細実装
4. QRコード決済対応
