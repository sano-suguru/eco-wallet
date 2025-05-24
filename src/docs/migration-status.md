# バーティカルスライスアーキテクチャ移行状況

## 完了した作業

### 1. バックアップディレクトリの削除

- `src/stores_backup_20250524_122817/`
- `src/components/charge_backup_20250524_124021/`
- `src/components/donation_backup_20250524_124129/`
- `src/components/settings_backup_20250524_124248/`

### 2. ビルドエラーの解消

- 未使用変数エラー
- 型の不一致エラー
- 循環参照エラー
- Zustandストアの不足メソッド
- 型定義のインポートパスエラー
- バックアップディレクトリのビルド除外

### 3. featuresモジュールへの移行状況

#### 移行完了

- ✅ features/transactions
- ✅ features/eco-impact
- ✅ features/campaigns
- ✅ features/balance
- ✅ features/auth
- ✅ features/settings
- ✅ features/layout
- ✅ features/invite
- ✅ features/charge
- ✅ features/donation

## 残作業

### 1. レガシーコンポーネントの削除準備

#### レイアウトコンポーネント（インポートパス更新が必要）

以下のファイルで `@/components/layout/` から `@/features/layout` への更新が必要：

- src/app/campaigns/page.tsx
- src/app/notifications/page.tsx
- src/app/notifications/[id]/page.tsx
- src/app/campaigns/[id]/page.tsx
- src/app/eco-news/page.tsx
- src/app/invite/page.tsx
- src/app/eco-news/[id]/page.tsx
- src/app/auth/register/page.tsx
- src/app/auth/forgot-password/page.tsx
- src/app/history/[id]/components/TransactionDetailView.tsx
- src/app/auth/login/page.tsx
- src/app/auth/register-success/page.tsx
- src/app/donate/[id]/page.tsx
- src/features/transactions/components/TransactionDetail/TransactionDetailView.tsx

#### その他のレガシーコンポーネント

移行済みのため削除可能：

- src/components/layout/ （features/layoutに移行済み）
- src/components/invite/ （features/inviteに移行済み）
- src/components/settings/ （features/settingsに移行済み）
- src/components/cards/Balance/ （features/balanceに移行済み）

### 2. ブリッジファイルの整理

以下のブリッジコンポーネントは段階的に削除：

- src/components/cards/BalanceCard.tsx
- src/components/cards/EcoImpactCard.tsx
- src/components/cards/FeaturedCampaignCard.tsx

### 3. レガシーHooksの移行

- src/hooks/ ディレクトリのhooksをfeaturesまたはsharedに移行

### 4. 残存する移行が必要なコンポーネント

- src/components/charge/
- src/components/donation/
- src/components/receipts/
- src/components/history/

### 5. データ・ユーティリティの整理

- src/lib/mock-data/ を適切なfeaturesに移行
- src/stores/slices/ をfeaturesに移行

## 優先順位

1. **高優先度**：レイアウトコンポーネントのインポートパス更新
2. **中優先度**：レガシーコンポーネントディレクトリの削除
3. **低優先度**：ブリッジファイルの削除とHooksの移行

## 注意事項

- 各ステップごとにビルドを確認
- 削除前に使用箇所の確認を徹底
- 段階的な移行でアプリケーションの動作を維持
