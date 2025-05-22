# 設定機能（Settings Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいた設定機能を含みます。

## ディレクトリ構造

```
settings/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── PageHeader/            # ページヘッダーコンポーネント
│   ├── ProfileCard/           # プロフィールカードコンポーネント
│   ├── SettingSection/        # 設定セクションコンポーネント
│   └── SettingsTabCard/       # 設定タブカードコンポーネント (将来追加予定)
├── data/                       # データソース（将来的に追加予定）
├── hooks/                      # カスタムフック（将来的に追加予定）
├── store/                      # 状態管理（将来的に追加予定）
├── types/                      # 型定義
│   └── settings.ts             # 設定関連の型定義
├── utils/                      # ユーティリティ関数（将来的に追加予定）
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // 型定義
  UserProfile,
  SecuritySettings,
  NotificationSettings,
  PaymentMethod,
  EcoSettings,
  SettingsTabType,

  // コンポーネント
  PageHeader,
  SettingSection,
  ProfileCard,

  // プロパティ型
  SettingSectionProps,
  ProfileCardProps,
} from "@/features/settings";
```

### コンポーネント例

#### ページヘッダー

```tsx
<PageHeader />
```

#### 設定セクション

```tsx
<SettingSection title="基本情報" description="アカウントの基本情報を編集します">
  {/* 設定項目 */}
</SettingSection>
```

#### プロフィールカード

```tsx
<ProfileCard
  user={currentUser}
  ecoContribution={{
    donation: 12000,
    forestArea: 5.2,
    co2Reduction: 25,
  }}
/>
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. ユーザープロフィール情報の表示と編集
2. セキュリティ設定の管理
3. 通知設定の管理
4. 決済方法の管理
5. エコ関連設定の管理

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 認証機能: `next-auth`
- アイコン: `lucide-react`

## 拡張予定

今後、以下の機能を追加予定です：

1. 設定タブコンポーネントの移行
2. 設定状態管理のためのストア
3. 設定のバリデーション機能
4. 設定の永続化と同期機能
