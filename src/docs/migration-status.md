# バーティカルスライスアーキテクチャ移行状況

## 概要

このドキュメントは、Eco Walletプロジェクトのバーティカルスライスアーキテクチャへの移行状況を追跡します。

## 移行完了したfeatures（12個）

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
✅ notifications - 通知機能
✅ payment - 決済機能

## 現在のディレクトリ構造

### レガシーコンポーネント (src/components)

- ✅ charge/ - ブリッジファイル化済み
- ✅ donation/ - ブリッジファイル化済み
- ✅ history/ - ブリッジファイル化済み
- ✅ receipts/ - ブリッジファイル化済み
- 🔧 ui/ - UIコンポーネント（維持）

### 削除済みディレクトリ

- ✅ src/components/cards/ - 削除完了
- ✅ src/components/eco/ - 削除完了
- ✅ src/components/transactions/ - 削除完了
- ✅ src/components/campaigns/ - 削除完了
- ✅ src/components/settings/ - 削除完了
- ✅ src/components/invite/ - 削除完了
- ✅ src/hooks/ - 削除完了
- ✅ src/stores/slices/ - 削除完了

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

#### 11. features/notificationsモジュールの作成

- ✅ 型定義の作成 (types/notification.ts)
- ✅ NotificationItemコンポーネントの作成
- ✅ NotificationListコンポーネントの作成
- ✅ NotificationBadgeコンポーネントの作成
- ✅ ストアの作成 (store/notification.slice.ts)
- ✅ モックデータの作成 (data/notifications-data.ts)
- ✅ READMEドキュメントの作成

#### 12. features/paymentモジュールの作成

- ✅ 型定義の作成 (types/payment.ts)
- ✅ ProductInfoコンポーネントの作成
- ✅ PaymentSummaryコンポーネントの作成
- ✅ PaymentMethodSelectorコンポーネントの作成
- ✅ PaymentOptionsコンポーネントの作成
- ✅ ストアの作成 (store/payment.slice.ts)
- ✅ モックデータの作成 (data/payment-data.ts)
- ✅ READMEドキュメントの作成

#### 13. レガシーコンポーネントの整理

- ✅ src/components/cards/ディレクトリを削除
- ✅ src/components/charge/のコンポーネントをブリッジファイル化
- ✅ src/components/donation/のコンポーネントをブリッジファイル化
- ✅ src/components/eco/ディレクトリを削除
- ✅ src/components/transactions/ディレクトリを削除
- ✅ src/components/campaigns/ディレクトリを削除
- ✅ src/components/settings/ディレクトリを削除
- ✅ src/components/invite/ディレクトリを削除
- ✅ src/hooks/ディレクトリを削除
- ✅ src/components/history/のコンポーネントをブリッジファイル化
- ✅ src/components/receipts/ElectronicReceiptをブリッジファイル化

#### 14. ストア構造の最適化

- ✅ src/stores/slices/の各sliceをfeatures/[機能名]/store/に移行完了
- ✅ レガシーストアディレクトリを削除
- ✅ すべてのインポートパスを更新

### 🚧 進行中のタスク

#### features/transferモジュールの作成（進行中）

- ✅ 型定義の作成 (types/transfer.ts)
- ✅ モックデータの作成 (data/recipients-data.ts)
- ✅ ユーティリティ関数の作成 (utils/validation.ts)
- ✅ フックの作成 (useTransferForm, useSplitForm)
- ✅ 基本コンポーネントの作成
  - ✅ RecipientSelector
  - ✅ SuccessMessage
- ✅ READMEドキュメントの作成
- ✅ インデックスファイルの作成
- 🚧 残りのコンポーネント作成
  - [ ] TransferForm
  - [ ] SplitForm
  - [ ] SplitHistoryList
  - [ ] TransferSplitPage（メインページコンポーネント）
- [ ] app/transfer/page.tsxの更新

## 段階的移行計画

### フェーズ1: 進行中のtransferモジュールの完成（1-2日）

1. **残りのコンポーネント作成**

   - TransferFormコンポーネント
   - SplitFormコンポーネント
   - SplitHistoryListコンポーネント
   - TransferSplitPage（統合コンポーネント）

2. **app/transfer/page.tsxの更新**

   - 新しいfeatureモジュールを使用するよう更新

3. **統合テスト**
   - 機能の動作確認
   - レイアウトの調整

### フェーズ2: eco-newsモジュールの作成（2-3日）

1. **基本構造の作成**

   ```
   features/eco-news/
   ├── types/
   │   └── eco-news.ts
   ├── data/
   │   └── eco-news-data.ts
   ├── components/
   │   ├── NewsCard/
   │   ├── NewsDetail/
   │   ├── NewsList/
   │   ├── CategoryFilter/
   │   └── SearchBar/
   ├── hooks/
   │   └── useEcoNews.ts
   ├── utils/
   │   └── news-utils.ts
   ├── README.md
   └── index.ts
   ```

2. **app/eco-news配下のページとの統合**
   - app/eco-news/page.tsx
   - app/eco-news/[id]/page.tsx

### フェーズ3: qrcodeモジュールの作成（1-2日）

1. **基本構造の作成**

   ```
   features/qrcode/
   ├── types/
   │   └── qrcode.ts
   ├── components/
   │   ├── QRCodeGenerator/
   │   ├── QRCodeScanner/
   │   └── QRCodeDisplay/
   ├── hooks/
   │   └── useQRCode.ts
   ├── utils/
   │   └── qrcode-utils.ts
   ├── README.md
   └── index.ts
   ```

2. **app/qrcode/page.tsxの更新**
   - 既存のqr-code-generator.tsxとの統合

### フェーズ4: splashモジュールの作成（1日）

1. **基本構造の作成**

   ```
   features/splash/
   ├── components/
   │   ├── SplashScreen/
   │   ├── LoadingAnimation/
   │   └── BrandLogo/
   ├── hooks/
   │   └── useSplashScreen.ts
   ├── README.md
   └── index.ts
   ```

2. **app/splash/page.tsxの更新**

### フェーズ5: レガシーコードの最終クリーンアップ（1-2日）

1. **残存ブリッジファイルの確認**

   - 使用状況の確認
   - 不要なものの削除

2. **共通型の整理**

   - src/types配下の整理
   - sharedディレクトリへの移行

3. **ユーティリティの整理**
   - src/lib配下の整理
   - 適切なfeatureモジュールへの移行

### フェーズ6: 最適化とドキュメント整備（2-3日）

1. **パフォーマンス最適化**

   - 遅延読み込みの実装
   - バンドルサイズの最適化
   - コード分割の最適化

2. **ドキュメントの更新**

   - 各featureのREADME.mdの更新
   - 全体的なアーキテクチャドキュメントの作成
   - 開発ガイドラインの作成

3. **テストの整備**
   - 各featureのテストファイル作成
   - E2Eテストの更新

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

### 型定義の配置ルール

- 共通型は`src/shared/types/`に配置
- feature固有の型は`src/features/[feature-name]/types/`に配置
- グローバル型定義は`src/types/`に配置（例：next-auth.d.ts）

### ストアの配置ルール

- 各featureのストアは`src/features/[feature-name]/store/`に配置
- 共通ストアは`src/shared/stores/`に配置

## 更新履歴

### 2025/01/25

- ドキュメントを現在のファイルシステムの状態に合わせて更新
- 削除済みディレクトリの一覧を追加
- 段階的移行計画を詳細化
- 配置ルールを明確化

### 2025/01/24

- src/components/history/のコンポーネントを適切なfeaturesモジュールに移行
- src/components/receipts/ElectronicReceiptをブリッジファイル化
