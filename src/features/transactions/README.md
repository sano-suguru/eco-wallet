# 取引機能（Transactions Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいた取引機能を含みます。

## ディレクトリ構造

```
transactions/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── TransactionItem/        # 取引アイテム表示コンポーネント
│   │   ├── TransactionItem.tsx # 実装
│   │   └── index.ts           # 公開API
│   ├── RecentTransactions/     # 最近の取引リストコンポーネント
│   │   ├── RecentTransactionsContainer.tsx  # コンテナ
│   │   ├── RecentTransactionsList.tsx       # プレゼンテーション
│   │   └── index.ts           # 公開API
│   └── TransactionDetail/      # 取引詳細表示コンポーネント
│       ├── TransactionDetailContainer.tsx   # コンテナ
│       ├── TransactionDetailView.tsx        # メインプレゼンテーション
│       ├── TransactionHeader.tsx            # ヘッダー部分
│       ├── TransactionInfo.tsx              # 情報表示部分
│       ├── TransactionEcoInfo.tsx           # 環境貢献情報
│       ├── ActionButtons.tsx                # アクションボタン
│       ├── ReceiptDialog.tsx                # レシートダイアログ
│       └── index.ts           # 公開API
├── types/                      # 型定義
│   ├── transaction.ts         # 取引関連の型定義
│   └── receipt.ts             # レシート関連の型定義
├── hooks/                      # カスタムフック
│   ├── transactionStyling.tsx   # 取引のスタイリング関数
│   └── useFormattedCurrency.ts  # 通貨フォーマットフック
├── store/                      # 状態管理
│   └── transaction.slice.ts    # Zustandストア
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // コンポーネント
  TransactionItem,
  RecentTransactionsContainer,
  TransactionDetailContainer,

  // 型定義
  Transaction,
  TransactionType,
  ReceiptItem,

  // フック
  getTransactionStyle,
  useFormattedCurrency,

  // ストア
  useTransactionStore,
} from "@/features/transactions";
```

### コンポーネント例

#### 取引アイテム

```tsx
<TransactionItem
  transaction={transaction}
  onClick={() => handleTransactionClick(transaction.id)}
/>
```

#### 最近の取引リスト

```tsx
<RecentTransactionsContainer limit={5} onViewAll={handleViewAll} />
```

#### 取引詳細

```tsx
// app/history/[id]/page.tsx
export default function TransactionDetailPage() {
  return <TransactionDetailContainer />;
}
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. 取引データの管理と表示
2. 取引履歴の一覧表示
3. 個別取引の詳細表示
4. レシート表示と共有
5. 取引のフィルタリング
6. 環境貢献情報の表示（eco-impact機能と連携）

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 環境貢献機能: `@/features/eco-impact`
- 状態管理: `zustand`

## 拡張予定

今後、以下の機能を追加予定です：

1. 取引の検索機能
2. 取引のソート機能
3. 取引のカテゴリ分類
4. 取引レポート出力
5. グラフ表示
