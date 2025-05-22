# 残高機能（Balance Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいた残高機能を含みます。

## ディレクトリ構造

```
balance/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── BalanceCard/           # 残高表示カード
│   │   ├── BalanceCardView.tsx    # 表示コンポーネント
│   │   ├── BalanceCardContainer.tsx # コンテナコンポーネント
│   │   └── index.ts           # 公開API
│   └── ... (将来追加予定の他コンポーネント)
├── types/                      # 型定義
│   └── balance.ts              # 残高関連の型定義
├── store/                      # 状態管理
│   └── balance.slice.ts        # 残高状態管理ストア
├── hooks/                      # カスタムフック（将来追加予定）
├── utils/                      # ユーティリティ関数（将来追加予定）
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // コンポーネント
  BalanceCardContainer,

  // ストア
  useBalanceStore,

  // 型定義
  BalanceInfo,
  BalanceHistoryItem,
  CampaignBalance,
} from "@/features/balance";
```

### コンポーネント例

#### 残高表示カード

```tsx
<BalanceCardContainer />
```

### ストア例

```tsx
// 残高情報の取得
const balance = useBalanceStore((state) => state.regularBalance);
const campaignBalances = useBalanceStore((state) => state.campaignBalances);

// 合計残高の取得
const totalBalance = useBalanceStore((state) => state.getTotalBalance());

// 残高の更新
const updateBalance = useBalanceStore((state) => state.updateBalance);
updateBalance(newBalance);
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. 残高情報の表示・管理
2. キャンペーン残高の管理
3. 残高に関する状態の一元管理
4. 残高関連コンポーネントの提供

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 共通ユーティリティ: `@/lib/utils/common`
- 状態管理: `zustand`
- アイコン: `lucide-react`

## 拡張予定

今後、以下の機能を追加予定です：

1. 残高履歴表示コンポーネント
2. 残高グラフ表示
3. 残高推移データ分析
4. キャンペーン残高詳細表示
