# 招待機能（Invite Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいた招待機能を含みます。

## ディレクトリ構造

```
invite/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── QRCodeDisplay/          # QRコード表示コンポーネント
│   └── SocialShareButtons/     # ソーシャルシェアボタンコンポーネント
├── data/                       # データソース（将来的に追加予定）
├── hooks/                      # カスタムフック（将来的に追加予定）
├── store/                      # 状態管理（将来的に追加予定）
├── types/                      # 型定義
│   └── invite.ts               # 招待関連の型定義
├── utils/                      # ユーティリティ関数（将来的に追加予定）
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // 型定義
  Invitation,
  InviteStatus,
  InviteShareOptions,

  // コンポーネント
  QRCodeDisplay,
  SocialShareButtons,

  // 型
  QRCodeDisplayProps,
  SocialShareButtonsProps,
} from "@/features/invite";
```

### コンポーネント例

#### QRコード表示

```tsx
<QRCodeDisplay
  value="https://eco-wallet.example.com/invite/ABC123"
  size={200}
/>
```

#### ソーシャルシェアボタン

```tsx
<SocialShareButtons
  inviteLink="https://eco-wallet.example.com/invite/ABC123"
  inviteMessage="Eco Walletに参加して環境保全に貢献しませんか？"
/>
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. 招待コードの生成と管理（将来的に追加予定）
2. 招待リンクのシェア機能の提供
3. QRコードを使った招待の表示
4. 招待状況の状態管理（将来的に追加予定）

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 共通ユーティリティ: `@/lib/utils`
- サードパーティライブラリ: `react-qr-code`

## 拡張予定

今後、以下の機能を追加予定です：

1. 招待コードの生成と検証ユーティリティ
2. 招待履歴と状態管理のためのストア
3. 招待キャンペーンとの連携機能
