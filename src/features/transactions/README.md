# トランザクション機能（Transactions Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいたトランザクション機能を含みます。

## ディレクトリ構造

```
transactions/
├── README.md             # このファイル（機能の説明）
├── components/           # UIコンポーネント
│   ├── TransactionItem/  # 取引項目コンポーネント
│   └── RecentTransactions/ # 最近の取引一覧コンポーネント
├── hooks/                # 機能固有のカスタムフック
│   ├── useFormattedCurrency.ts # 通貨フォーマット
│   └── useTransactionStyling.tsx # スタイリングロジック
├── store/                # 状態管理
│   └── transaction.slice.ts # 取引のZustandスライス
├── types/                # 型定義
│   ├── transaction.ts    # 取引の型
│   └── receipt.ts        # レシートの型
└── index.ts              # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // 型
  Transaction,
  TransactionType,
  ReceiptItem,

  // ストア
  useTransactionStore,

  // フック
  useTransactionStyling,
  useFormattedCurrency,

  // コンポーネント
  TransactionItem,
  RecentTransactionsContainer,
} from "@/features/transactions";
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. 取引データの型定義
2. 取引データの状態管理
3. 取引リストの表示
4. 取引詳細の表示
5. 取引関連の書式設定とスタイリング

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 環境影響コンポーネント: `@/components/eco/CompactEcoImpact`
- モックデータ: `@/lib/mock-data/transactions-data`

## 拡張方法

新しいトランザクション機能を追加する場合は、このディレクトリ内に適切なファイルを作成し、`index.ts`から公開してください。
