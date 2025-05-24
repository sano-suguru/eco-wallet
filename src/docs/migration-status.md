# バーティカルスライスアーキテクチャ移行状況

## 概要

このドキュメントは、Eco Walletプロジェクトのバーティカルスライスアーキテクチャへの移行状況を追跡します。

## 移行完了したfeatures（10個）

✅ transactions - 取引履歴・詳細表示機能
✅ eco-impact - 環境貢献機能
✅ campaigns - キャンペーン機能
✅ balance - 残高表示機能
✅ auth - 認証機能
✅ settings - 設定機能
✅ layout - レイアウト共通コンポーネント
✅ invite - 招待機能
✅ charge - チャージ機能
✅ donation - 寄付機能

## 移行状況

### ✅ 完了したタスク

#### 1. features/transactionsモジュールの作成

- ✅ 型定義の移行 (types/receipt.ts)
- ✅ TransactionItemコンポーネントの作成
- ✅ RecentTransactionsコンポーネントの分割と移行
- ✅ TransactionDetailコンポーネント群の移行
- ✅ TransactionDetailSectionコンポーネントの移行
- ✅ ストアの移行 (store/transaction.slice.ts)
- ✅ フックの作成 (useTransactionStyling, useTransactionFilters)
- ✅ READMEドキュメントの作成
- ✅ TransactionFiltersコンポーネントの作成
- ✅ TransactionListコンポーネントの作成

#### 2. features/eco-impactモジュールの作成

- ✅ 型定義の作成 (types/eco-impact.ts)
- ✅ CompactEcoImpactコンポーネントの移行
- ✅ EcoImpactDisplayコンポーネントの移行
- ✅ TransactionEcoImpactコンポーネントの移行
- ✅ NewsAndProjectsコンポーネントの移行
- ✅ RecommendedActionコンポーネントの移行
- ✅ EcoContributionSummaryコンポーネントの作成
- ✅ ストアの移行 (store/eco-impact.slice.ts)
- ✅ ユーティリティ関数の作成 (utils/calculations.ts)
- ✅ フックの作成 (hooks/useEcoImpact.ts)
- ✅ READMEドキュメントの作成

#### 3. features/campaignsモジュールの作成

- ✅ 型定義の作成 (types/campaign.ts)
- ✅ CampaignCardコンポーネントの作成
- ✅ FeaturedCampaignSectionコンポーネントの作成
- ✅ NotificationCampaignCardコンポーネントの移行
- ✅ ReferralCampaignCardコンポーネントの移行
- ✅ ストアの移行 (store/campaign.slice.ts)
- ✅ ユーティリティ関数の作成 (utils/campaign-utils.ts)
- ✅ モックデータの移行 (data/campaigns-data.ts)
- ✅ READMEドキュメントの作成

#### 4. features/balanceモジュールの作成

- ✅ 型定義の作成 (types/balance.ts)
- ✅ BalanceCardコンポーネントの移行
- ✅ BalanceOverviewコンポーネントの作成
- ✅ ストアの移行 (store/balance.slice.ts)
- ✅ READMEドキュメントの作成

#### 5. features/authモジュールの作成

- ✅ 型定義の作成 (types/auth.ts)
- ✅ LoginFormコンポーネントの移行
- ✅ AuthFormコンポーネントの移行
- ✅ AuthFieldコンポーネントの移行
- ✅ LogoutButtonコンポーネントの移行
- ✅ フックの移行 (hooks/useAuthForm.ts)
- ✅ READMEドキュメントの作成

#### 6. features/settingsモジュールの作成

- ✅ 型定義の作成 (types/settings.ts)
- ✅ PageHeaderコンポーネントの移行
- ✅ SettingSectionコンポーネントの移行
- ✅ ProfileCardコンポーネントの移行
- ✅ タブコンポーネントの移行 (ProfileTab, NotificationsTab, PaymentTab, SecurityTab, EcoTab)
- ✅ READMEドキュメントの作成

#### 7. features/layoutモジュールの作成

- ✅ AuthLayoutコンポーネントの移行
- ✅ PageContainerコンポーネントの移行
- ✅ AppHeaderコンポーネントの移行
- ✅ AppFooterコンポーネントの移行
- ✅ READMEドキュメントの作成

#### 8. features/inviteモジュールの作成

- ✅ 型定義の作成 (types/invite.ts)
- ✅ InviteCardコンポーネントの移行
- ✅ QRCodeDisplayコンポーネントの移行
- ✅ SocialShareButtonsコンポーネントの移行
- ✅ READMEドキュメントの作成

#### 9. features/chargeモジュールの作成

- ✅ 型定義の作成 (types/charge.ts)
- ✅ ChargeInputコンポーネント群の移行
- ✅ BankTransferSectionコンポーネントの移行
- ✅ ChargeConfirmコンポーネントの移行
- ✅ ChargeCompleteコンポーネントの移行
- ✅ READMEドキュメントの作成

#### 10. features/donationモジュールの作成

- ✅ 型定義の作成 (types/donation.ts)
- ✅ DonateInputコンポーネント群の移行
- ✅ DonateConfirmコンポーネントの移行
- ✅ DonateCompleteコンポーネントの移行
- ✅ ユーティリティ関数の作成 (utils/project-converter.ts)
- ✅ READMEドキュメントの作成

#### 11. レガシーコンポーネントの整理

- ✅ src/components/cards/ディレクトリを削除
- ✅ src/components/charge/のコンポーネントをブリッジファイル化
- ✅ src/components/donation/のコンポーネントをブリッジファイル化
- ✅ src/components/eco/ディレクトリを削除（features/eco-impactに移行済み）
- ✅ src/components/transactions/ディレクトリを削除（features/transactionsに移行済み）
- ✅ src/components/campaigns/ディレクトリを削除（features/campaignsに移行済み）
- ✅ src/hooks/ディレクトリを削除（各featuresに移行済み）
- ✅ src/components/history/のコンポーネントをブリッジファイル化
- ✅ src/components/receipts/ElectronicReceiptをブリッジファイル化

### 🚧 進行中のタスク

なし

### 📋 今後のタスク

#### ストア構造の最適化

- src/stores/slices/の各sliceをfeatures/[機能名]/store/に移行検討

#### レガシーコンポーネントディレクトリの削除

- src/components/settings/ディレクトリの削除（features/settingsに移行済み - 確認後削除）

#### その他

- 各featureのテストファイルの作成
- Storybook設定の更新
- CI/CDパイプラインの更新確認
- パフォーマンス最適化（遅延読み込みなど）

## 移行時の注意事項

### インポートパスの更新

レガシーコンポーネントから新しいfeatureモジュールへの移行時は、以下のパターンでインポートパスを更新：

```typescript
// Before
import { Component } from "@/components/category/Component";

// After
import { Component } from "@/features/feature-name";
```

### ブリッジファイルの作成

移行期間中の互換性維持のため、レガシーコンポーネントファイルはブリッジファイルとして残す：

```typescript
// src/components/legacy/Component.tsx
export { Component } from "@/features/feature-name";
```

### 型定義の移行

- 共通型は`src/shared/types/`に配置
- feature固有の型は`src/features/[feature-name]/types/`に配置

## 更新履歴

### 2025/01/24

- src/components/history/のコンポーネントを適切なfeaturesモジュールに移行
  - BalanceOverview → features/balance/components/BalanceOverview/
  - TransactionFilters → features/transactions/components/TransactionFilters/
  - TransactionList → features/transactions/components/TransactionList/
  - EcoContributionSummary → features/eco-impact/components/EcoContributionSummary/
- src/components/history/index.tsxをブリッジファイル化
- src/components/receipts/ElectronicReceiptは既にブリッジファイル化済みを確認
