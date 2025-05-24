# レイアウト機能（Layout Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいたレイアウト機能を含みます。

## ディレクトリ構造

```
layout/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── AppHeader/              # アプリケーションヘッダー
│   │   ├── AppHeader.tsx       # 実装
│   │   └── index.ts           # 公開API
│   ├── AppFooter/              # アプリケーションフッター
│   │   ├── AppFooter.tsx       # 実装
│   │   └── index.ts           # 公開API
│   ├── AuthLayout/             # 認証画面用レイアウト
│   │   ├── AuthLayout.tsx      # 実装
│   │   └── index.ts           # 公開API
│   └── PageContainer/          # ページコンテナ
│       ├── PageContainer.tsx   # 実装
│       └── index.ts           # 公開API
├── types/                      # 型定義（現在は空）
├── hooks/                      # カスタムフック（現在は空）
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントをインポートします：

```typescript
import {
  AppHeader,
  AppFooter,
  AuthLayout,
  PageContainer,
} from "@/features/layout";
```

### コンポーネント例

#### PageContainer（標準的なページレイアウト）

```tsx
<PageContainer
  title="取引履歴"
  activeTab="history"
  showHeader={true}
  showFooter={true}
>
  {/* ページコンテンツ */}
</PageContainer>
```

#### AuthLayout（認証画面用レイアウト）

```tsx
<AuthLayout title="ログイン" subtitle="アカウントにログインしてください">
  {/* 認証フォーム */}
</AuthLayout>
```

#### AppHeader（ヘッダーのみ使用）

```tsx
<AppHeader
  title="Eco Wallet"
  showAvatar={true}
  showSettings={true}
  showNotifications={true}
/>
```

#### AppFooter（フッターのみ使用）

```tsx
<AppFooter activeTab="home" />
```

## Props

### PageContainer

- `children`: ReactNode - ページコンテンツ
- `title?`: string - ヘッダーに表示するタイトル（デフォルト: "Eco Wallet"）
- `activeTab?`: "home" | "pay" | "eco" | "history" | "account" - アクティブなタブ
- `showHeader?`: boolean - ヘッダーを表示するか（デフォルト: true）
- `showFooter?`: boolean - フッターを表示するか（デフォルト: true）
- `showAvatar?`: boolean - アバターを表示するか（デフォルト: true）
- `showSettings?`: boolean - 設定ボタンを表示するか（デフォルト: true）
- `showNotifications?`: boolean - 通知ボタンを表示するか（デフォルト: true）

### AuthLayout

- `children`: ReactNode - 認証フォームコンテンツ
- `title`: string - ページタイトル
- `subtitle?`: string - サブタイトル（オプション）

### AppHeader

- `title?`: string - タイトル（デフォルト: "Eco Wallet"）
- `showAvatar?`: boolean - アバターを表示するか
- `showSettings?`: boolean - 設定ボタンを表示するか
- `showNotifications?`: boolean - 通知ボタンを表示するか

### AppFooter

- `activeTab?`: "home" | "pay" | "eco" | "history" | "account" - アクティブなタブ

## 責任

この機能モジュールは以下の責任を持ちます：

1. アプリケーション全体の共通レイアウトの提供
2. ヘッダー・フッターナビゲーションの管理
3. 認証画面専用のレイアウト提供
4. レスポンシブデザインの実装
5. ナビゲーション状態の管理

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 認証機能: `next-auth/react`
- アイコン: `lucide-react`

## 移行ガイド

従来の `@/components/layout/` からの移行：

```typescript
// 旧インポート
import { PageContainer } from "@/components/layout/PageContainer";

// 新インポート（ブリッジコンポーネント経由でも動作）
import { PageContainer } from "@/features/layout";
```

ブリッジコンポーネントにより、既存のインポートパスは引き続き動作しますが、新規開発では `@/features/layout` からのインポートを推奨します。
