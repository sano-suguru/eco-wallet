# エコインパクト機能（Eco Impact Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいたエコインパクト機能を含みます。

## ディレクトリ構造

```
eco-impact/
├── README.md             # このファイル（機能の説明）
├── components/           # UIコンポーネント
│   └── CompactEcoImpact/ # コンパクト表示コンポーネント
├── hooks/                # 機能固有のカスタムフック
│   └── useEcoImpact.ts   # エコインパクト管理フック
├── store/                # 状態管理
│   └── eco-impact.slice.ts # エコインパクトのZustandスライス
├── types/                # 型定義
│   └── eco-impact.ts     # エコインパクトの型
├── utils/                # ユーティリティ関数
│   └── calculations.ts   # 環境影響計算関数
└── index.ts              # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // 型
  EcoRank,
  ContributionParams,
  EcoImpactCalculation,

  // ストア
  useEcoImpactStore,

  // フック
  useEcoImpact,

  // ユーティリティ関数
  calculateEcoImpact,
  getEcoRankFromDonation,

  // コンポーネント
  CompactEcoImpact,
} from "@/features/eco-impact";
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. 環境貢献データの型定義
2. 環境貢献データの状態管理
3. 環境影響の計算と表示
4. 環境貢献ランクの管理

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- モックデータ: `@/lib/mock-data/eco-impact`

## 拡張方法

より高度な環境インパクト表示やレポートを追加する場合は、このディレクトリ内に適切なコンポーネントを作成し、`index.ts`から公開してください。
