# バーティカルスライスアーキテクチャ移行状況

## 概要

このドキュメントは、従来のレイヤードアーキテクチャからバーティカルスライスアーキテクチャへの移行作業の進捗を追跡します。

## 移行戦略

1. **機能別モジュール化**: 各機能を独立したfeatureモジュールとして再構成
2. **段階的移行**: 既存のコードを壊さないように段階的に移行
3. **インポートパスの統一**: features/[機能名] からの公開APIを使用

## 完了したFeatures ✅

### 1. features/transactions

- ✅ types/の移行
- ✅ hooks/の移行
- ✅ store/の移行
- ✅ components/の移行
- ✅ utils/の移行
- ✅ 公開APIの定義（index.ts）

### 2. features/eco-impact

- ✅ types/の移行
- ✅ hooks/の移行
- ✅ components/の移行
- ✅ store/の移行
- ✅ utils/の移行
- ✅ 公開APIの定義（index.ts）

### 3. features/campaigns

- ✅ types/の移行
- ✅ components/の移行
- ✅ store/の移行
- ✅ utils/の移行
- ✅ data/の移行
- ✅ 公開APIの定義（index.ts）

### 4. features/balance

- ✅ types/の移行
- ✅ components/の移行
- ✅ store/の移行
- ✅ utils/の移行
- ✅ 公開APIの定義（index.ts）

### 5. features/auth

- ✅ types/の移行
- ✅ hooks/の移行
- ✅ components/の移行
- ✅ utils/の移行
- ✅ 公開APIの定義（index.ts）

### 6. features/settings

- ✅ types/の移行
- ✅ components/の移行
- ✅ 公開APIの定義（index.ts）

### 7. features/layout

- ✅ components/の移行
- ✅ 公開APIの定義（index.ts）
- ✅ すべてのインポートパスを更新（2025/5/24完了）

### 8. features/invite

- ✅ components/の移行
- ✅ types/の移行
- ✅ 公開APIの定義（index.ts）

### 9. features/charge

- ✅ types/の移行
- ✅ components/の移行
- ✅ utils/の移行
- ✅ 公開APIの定義（index.ts）

### 10. features/donation

- ✅ types/の移行
- ✅ components/の移行
- ✅ store/の移行
- ✅ utils/の移行
- ✅ 公開APIの定義（index.ts）

## 残作業

### 1. レガシーコンポーネントの削除準備

#### レガシーコンポーネントディレクトリの削除（移行済み）

- ✅ src/components/layout/ （features/layoutに移行済み - 削除完了 2025/5/24）
- ✅ src/components/invite/ （features/inviteに移行済み - 削除完了 2025/5/24）
- ✅ src/components/settings/ （features/settingsに移行済み - 削除完了 2025/5/24）
- ✅ src/components/cards/Balance/ （features/balanceに移行済み - 削除完了 2025/5/24）

#### レガシーコンポーネントファイルの削除（ブリッジファイル）

- ✅ src/components/cards/BalanceCard.tsx （削除完了 2025/5/24）
- ✅ src/components/cards/EcoImpactCard.tsx （削除完了 2025/5/24）
- ✅ src/components/cards/FeaturedCampaignCard.tsx （削除完了 2025/5/24）

### 2. 共通機能の整理

#### Hooksの移行

- ✅ src/hooks/ディレクトリのhooksをfeaturesまたはsharedに移行（完了 2025/5/24）
  - ✅ useAuthForm.ts → features/auth/hooks/（移行済み）
  - ✅ useFormValidation.ts → shared/hooks/（移行済み）
  - ✅ useEcoImpact.ts → features/eco-impact/hooks/（移行済み）
  - ✅ useTransactionFilters.ts → features/transactions/hooks/（移行済み）
  - ✅ useTransactionStyling.tsx → features/transactions/hooks/（移行済み）
  - ✅ src/hooks/ディレクトリを削除（完了）

### 3. その他のレガシーコンポーネント

- ✅ src/components/cards/ （削除完了 2025/5/24）
  - ✅ InviteCard.tsx → features/invite/components/InviteCard/へ移行
- ✅ src/components/charge/ （ブリッジファイルに変換完了 2025/5/24）
  - ✅ ChargeStepConfirm.tsx → features/charge/components/ChargeConfirm/へ移行
  - ✅ ChargeStepComplete.tsx → features/charge/components/ChargeComplete/へ移行
  - ✅ ChargeStepInput.tsx → 既存のブリッジファイルを維持
- src/components/transactions/ → 削除（features/transactionsに移行済み）
- src/components/eco/ → 削除（features/eco-impactに移行済み）
- src/components/donation/ → features/donationへの移行確認
- src/components/campaigns/ → 削除（features/campaignsに移行済み）
- src/components/history/ → features/transactionsへの移行確認
- src/components/receipts/ → features/transactionsへの移行検討

### 4. ストア構造の最適化

- src/stores/slices/の各sliceをfeatures/[機能名]/store/に移行検討

## 技術的な注意事項

### 循環参照の回避

- features間の直接インポートを避ける
- 共通の型定義はshared/types/に配置
- 共通のユーティリティはshared/utils/に配置

### 公開APIの設計原則

- 各featureのindex.tsから必要最小限のものだけをexport
- 内部実装の詳細は外部に公開しない
- featureの独立性を保つ

### 命名規則

- feature名: 複数形または機能を表す名詞（例: transactions, auth）
- コンポーネント: PascalCase
- hooks: use接頭辞
- utils: camelCase

## 今後の課題

1. テストファイルの移行
2. Storybook設定の更新
3. CI/CDパイプラインの更新確認
4. パフォーマンス最適化（遅延読み込みなど）
