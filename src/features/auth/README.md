# 認証機能（Auth Feature）

このディレクトリはバーティカルスライスアーキテクチャに基づいた認証機能を含みます。

## ディレクトリ構造

```
auth/
├── README.md                   # このファイル（機能の説明）
├── components/                 # UIコンポーネント
│   ├── AuthField/             # 認証入力フィールド
│   │   ├── AuthField.tsx       # AuthField実装
│   │   └── index.ts           # 公開API
│   ├── AuthForm/              # 認証フォーム
│   │   ├── AuthForm.tsx        # AuthForm実装
│   │   └── index.ts           # 公開API
│   └── LogoutButton/          # ログアウトボタン
│       ├── LogoutButton.tsx    # LogoutButton実装
│       └── index.ts           # 公開API
├── types/                      # 型定義
│   └── auth.ts                # 認証関連の型定義
├── hooks/                      # カスタムフック（将来追加予定）
├── utils/                      # ユーティリティ関数（将来追加予定）
├── store/                      # 状態管理（将来追加予定）
└── index.ts                    # 公開API（エクスポート）
```

## 使い方

機能を使用するには、公開APIからコンポーネントと型をインポートします：

```typescript
import {
  // コンポーネント
  AuthField,
  AuthForm,
  LogoutButton,

  // 型定義
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
} from "@/features/auth";
```

### コンポーネント例

#### 認証フィールド

```tsx
<AuthField
  id="email"
  label="メールアドレス"
  type="email"
  placeholder="your@email.com"
  register={register}
  errors={errors}
  required
  icon={<AtSign className="h-4 w-4" />}
/>
```

#### 認証フォーム

```tsx
<AuthForm
  title="ログイン"
  subtitle="アカウントにログイン"
  onSubmit={handleSubmit}
  submitText="ログイン"
  isSubmitting={isLoading}
  error={error}
  footerLink={
    <Link href="/auth/register">アカウントをお持ちでない方はこちら</Link>
  }
>
  {formFields}
</AuthForm>
```

#### ログアウトボタン

```tsx
<LogoutButton label="ログアウト" showIcon={true} variant="ghost" />
```

## 責任

この機能モジュールは以下の責任を持ちます：

1. ユーザーの認証処理（ログイン、ログアウト）
2. 認証関連UIコンポーネントの提供（フォーム、入力フィールドなど）
3. 認証状態の管理
4. 認証情報の検証

## 外部依存関係

- UI基本コンポーネント: `@/components/ui/`
- 認証ライブラリ: `next-auth`
- フォーム管理: `react-hook-form`
- バリデーション: `zod`

## 拡張予定

今後、以下の機能を追加予定です：

1. カスタムフック（useAuth, useAuthForm）
2. 認証状態管理（auth.slice.ts）
3. ユーザープロファイル管理
4. 権限管理
5. ソーシャルログイン連携
