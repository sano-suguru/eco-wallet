# キャンペーン機能（Campaigns Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいたキャンペーン機能を含みます。

## ディレクトリ構造

```
campaigns/
├── README.md                 # このファイル（機能の説明）
├── components/               # UIコンポーネント
│   ├── CampaignCard/         # キャンペーンカードコンポーネント
│   └── FeaturedCampaign/     # 注目キャンペーンコンポーネント
├── data/                     # データソース
│   └── campaigns-data.ts     # キャンペーンのモックデータ
├── store/                    # 状態管理
│   └── campaign.slice.ts     # キャンペーンのZustandスライス
├── types/                    # 型定義
│   └── campaign.ts           # キャンペーンの型
├── utils/                    # ユーティリティ関数
│   └── campaign-utils.ts     # キャンペーン関連のヘルパー関数
└── index.ts                  # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // 型
  Campaign,
  CampaignType,

  // ストア
  useCampaignStore,

  // ユーティリティ関数
  findCampaignById,
  filterActiveCampaigns,
  filterPopularCampaigns,
  filterCampaignsByType,

  // コンポーネント
  CampaignCard,
  FeaturedCampaignSection,
} from "@/features/campaigns";
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. キャンペーン関連データの型定義
2. キャンペーンデータの状態管理
3. キャンペーン情報の表示と操作
4. キャンペーン関連のユーティリティ関数の提供

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- その他の共通ユーティリティ: `@/lib/utils`

## 拡張方法

キャンペーン機能を拡張する際の主なポイント：

1. 新しいキャンペーンタイプを追加する場合は、`types/campaign.ts`の`CampaignType`型を拡張
2. キャンペーンの表示方法を追加する場合は、`components/`ディレクトリに新しいコンポーネントを作成
3. キャンペーンデータの操作に新しい機能が必要な場合は、`utils/campaign-utils.ts`に追加
4. ストアに新しいアクションやクエリを追加する場合は、`store/campaign.slice.ts`を更新
