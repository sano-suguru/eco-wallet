# Transfer Feature

送金・割り勘機能を提供するfeatureモジュールです。

## 概要

このfeatureは以下の機能を提供します：

- 個人間送金
- 割り勘機能
- 送金履歴の管理
- 環境貢献寄付オプション

## ディレクトリ構造

```
features/transfer/
├── components/
│   ├── TransferSplitPage/     # メインページコンポーネント
│   ├── TransferForm/          # 送金フォーム
│   ├── SplitForm/             # 割り勘フォーム
│   ├── RecipientSelector/     # 受取人選択
│   ├── SplitHistoryList/      # 割り勘履歴リスト
│   └── SuccessMessage/        # 成功メッセージ
├── hooks/
│   ├── useTransferForm.ts     # 送金フォームロジック
│   └── useSplitForm.ts        # 割り勘フォームロジック
├── types/
│   └── transfer.ts            # 型定義
├── utils/
│   └── validation.ts          # バリデーション関数
├── data/
│   └── recipients-data.ts     # モックデータ
└── index.ts
```

## 主要な型定義

```typescript
// 受取人
interface Recipient {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  email?: string;
  isEcoUser?: boolean;
}

// 送金フォームデータ
interface TransferFormData {
  recipient: string;
  selectedRecipient: Recipient | null;
  amount: string;
  message?: string;
  isDonateChecked: boolean;
}

// 割り勘参加者
interface SplitParticipant {
  id: string;
  name: string;
  isPayor?: boolean;
  isEcoUser?: boolean;
  amount: string;
  email: string;
}
```

## 使用例

### 送金機能

```typescript
import { useTransferForm } from "@/features/transfer";

const TransferExample = () => {
  const {
    formData,
    updateField,
    selectRecipient,
    handleTransfer,
    isProcessing,
    error,
    isSuccess,
  } = useTransferForm();

  // 送金処理
  const onSubmit = async () => {
    await handleTransfer();
  };
};
```

### 割り勘機能

```typescript
import { useSplitForm } from "@/features/transfer";

const SplitExample = () => {
  const {
    formData,
    updateField,
    updateParticipantAmount,
    distributeEvenly,
    handleSplitRequest,
    isProcessing,
    error,
  } = useSplitForm();

  // 割り勘請求処理
  const onSubmit = async () => {
    await handleSplitRequest();
  };
};
```

## 主要機能

### 送金機能

- 受取人の選択（最近の送金先から選択可能）
- 金額入力とバリデーション
- 環境貢献寄付オプション（1%）
- 残高チェック
- トランザクション記録

### 割り勘機能

- 参加者の追加・削除
- 金額の自動分配（均等割り）
- 個別金額の設定
- 電子レシートオプション
- 送金方法の選択（Wallet/銀行振込/QRコード）

## 依存関係

- `@/features/transactions` - トランザクション管理
- `@/features/balance` - 残高管理
- `@/features/layout` - レイアウトコンポーネント
- `@/shared/hooks` - 共通フック
- `next-auth/react` - 認証情報

## テスト

```bash
# ユニットテスト
npm run test features/transfer

# 統合テスト
npm run test:integration features/transfer
```

## 今後の改善点

- [ ] リアルタイムバリデーション
- [ ] 送金予約機能
- [ ] 繰り返し送金機能
- [ ] グループ割り勘機能
- [ ] 送金通知機能
