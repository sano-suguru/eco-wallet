# Eco Wallet 開発ガイド

## 概要

このガイドは、Eco Walletのバーティカルスライスアーキテクチャに基づいた開発方法を説明します。新機能の追加、既存機能の修正、コンポーネントの作成など、開発に必要な情報を提供します。

## アーキテクチャ原則

### 1. バーティカルスライスアーキテクチャ

Eco Walletは機能単位でコードを組織化しています。各機能（feature）は独立したモジュールとして実装され、以下の利点があります：

- **独立性**: 各featureは独立して開発・テスト可能
- **保守性**: 機能ごとに整理されているため、コードの理解と修正が容易
- **再利用性**: 明確な公開APIにより、コンポーネントの再利用が簡単
- **拡張性**: 新機能の追加が既存コードに影響を与えにくい

### 2. 命名規則

- **コンポーネント**: PascalCase (`TransactionList`, `PaymentForm`)
- **フック**: camelCase + use接頭辞 (`useAuth`, `useBalance`)
- **型**: PascalCase、接尾辞で役割を明示 (`UserData`, `TransactionProps`)
- **ファイル**: コンポーネント/クラス名と一致させる
- **定数**: UPPER_SNAKE_CASE (`MAX_AMOUNT`, `DEFAULT_CURRENCY`)
- **関数**: camelCase (`calculateTotal`, `formatDate`)

## 新機能の追加

### 1. Feature モジュールの作成

新しい機能を追加する場合、以下の手順に従います：

```bash
# 新しいfeatureディレクトリを作成
mkdir -p src/features/[feature-name]/{components,hooks,store,types,utils,data}
```

### 2. 必須ファイルの作成

#### index.ts（公開API）

```typescript
// src/features/[feature-name]/index.ts
export { FeatureComponent } from "./components/FeatureComponent";
export { useFeatureHook } from "./hooks/useFeatureHook";
export type { FeatureType } from "./types/feature.types";
```

#### README.md（ドキュメント）

```markdown
# [Feature Name] モジュール

## 概要

この機能の目的と責任範囲を説明

## 主要コンポーネント

- ComponentA: 説明
- ComponentB: 説明

## 使用方法

\`\`\`typescript
import { FeatureComponent } from '@/features/[feature-name]';
\`\`\`
```

### 3. 型定義の作成

```typescript
// src/features/[feature-name]/types/feature.types.ts
export interface FeatureData {
  id: string;
  // その他のプロパティ
}

export interface FeatureProps {
  data: FeatureData;
  onAction?: (id: string) => void;
}
```

### 4. コンポーネントの実装

```typescript
// src/features/[feature-name]/components/FeatureComponent.tsx
import React from 'react';
import { FeatureProps } from '../types/feature.types';

export const FeatureComponent: React.FC<FeatureProps> = ({ data, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* コンポーネントの実装 */}
    </div>
  );
};
```

## 既存機能の修正

### 1. 影響範囲の確認

修正前に以下を確認：

- 該当featureの`README.md`を読む
- 公開API（`index.ts`）を確認
- 他のfeatureからの依存を確認

### 2. テストの実行

```bash
# 単体テストの実行
npm run test

# 特定のfeatureのテスト
npm run test -- features/[feature-name]
```

### 3. 型安全性の確保

TypeScriptの型チェックを活用：

```bash
# 型チェックの実行
npm run type-check
```

## 共通パターン

### 1. フックの作成パターン

```typescript
// src/features/[feature-name]/hooks/useFeature.ts
import { useState, useEffect } from "react";
import { FeatureData } from "../types/feature.types";

export const useFeature = (id: string) => {
  const [data, setData] = useState<FeatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // データ取得ロジック
  }, [id]);

  return { data, loading, error };
};
```

### 2. ストアの作成パターン

```typescript
// src/features/[feature-name]/store/feature.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeatureData } from "../types/feature.types";

interface FeatureState {
  items: FeatureData[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  items: [],
  loading: false,
  error: null,
};

export const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<FeatureData[]>) => {
      state.items = action.payload;
    },
    // その他のreducers
  },
});

export const { setItems } = featureSlice.actions;
export default featureSlice.reducer;
```

### 3. ユーティリティ関数のパターン

```typescript
// src/features/[feature-name]/utils/feature-utils.ts
export const formatFeatureData = (data: FeatureData): string => {
  // フォーマットロジック
  return formatted;
};

export const validateFeatureInput = (input: unknown): boolean => {
  // バリデーションロジック
  return isValid;
};
```

## スタイリングガイドライン

### 1. Tailwind CSS の使用

```typescript
// 推奨: Tailwind CSSクラスを使用
<div className="p-4 bg-white rounded-lg shadow-md">

// 避ける: インラインスタイル
<div style={{ padding: '16px', background: 'white' }}>
```

### 2. カラーパレット

デザインガイドラインに従い、以下の色を使用：

- **プライマリ**: `bg-teal-700` (#0F766E)
- **セカンダリ**: `bg-stone-500` (#78716C)
- **アクセント**: `bg-amber-600` (#D97706)
- **成功**: `bg-green-600` (#16A34A)
- **エラー**: `bg-red-600` (#DC2626)

### 3. レスポンシブデザイン

```typescript
<div className="
  w-full
  md:w-1/2     // タブレット以上で半分の幅
  lg:w-1/3     // デスクトップで1/3の幅
">
```

## テスト方針

### 1. 単体テスト

各featureごとにテストを作成：

```typescript
// src/features/[feature-name]/__tests__/FeatureComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { FeatureComponent } from '../components/FeatureComponent';

describe('FeatureComponent', () => {
  it('renders correctly', () => {
    render(<FeatureComponent data={mockData} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 2. 統合テスト

feature間の連携をテスト：

```typescript
// src/__tests__/integration/feature-integration.test.tsx
import { renderWithProviders } from "@/test/utils";
import { FeatureA } from "@/features/feature-a";
import { FeatureB } from "@/features/feature-b";

describe("Feature Integration", () => {
  it("features work together correctly", () => {
    // テストの実装
  });
});
```

## パフォーマンス最適化

### 1. 遅延読み込み

```typescript
// src/app/[feature]/page.tsx
import dynamic from 'next/dynamic';

const FeatureComponent = dynamic(
  () => import('@/features/[feature-name]').then(mod => mod.FeatureComponent),
  {
    loading: () => <LoadingSpinner />,
    ssr: false // 必要に応じて
  }
);
```

### 2. メモ化

```typescript
// 高コストな計算のメモ化
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// コンポーネントのメモ化
const MemoizedComponent = React.memo(Component);
```

### 3. 画像の最適化

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
/>
```

## デバッグとトラブルシューティング

### 1. Redux DevTools

ストアの状態を確認：

```typescript
// ブラウザの拡張機能でRedux DevToolsを使用
// Chrome: Redux DevTools Extension
```

### 2. React Developer Tools

コンポーネントツリーとpropsを確認：

```typescript
// ブラウザの拡張機能でReact Developer Toolsを使用
// Chrome: React Developer Tools
```

### 3. ログの活用

```typescript
// 開発環境でのみログを出力
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}
```

## よくある質問

### Q1: 新しいページを追加するには？

```bash
# 1. ページファイルを作成
touch src/app/[page-name]/page.tsx

# 2. 関連するfeatureを作成または既存のものを使用
# 3. ページコンポーネントを実装
```

### Q2: 共通コンポーネントはどこに配置する？

- **UI基本要素**: `src/components/ui/`（Button、Input等）
- **Feature間共有**: `src/shared/components/`
- **Feature固有**: `src/features/[feature-name]/components/`

### Q3: 環境変数の使用方法は？

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com

// 使用方法
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Q4: エラーハンドリングのベストプラクティスは？

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // ユーザーへのフィードバック
  toast.error("エラーが発生しました");

  // 開発環境でのログ
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  // エラーの再スロー（必要に応じて）
  throw error;
}
```

## リソース

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [shadcn/ui コンポーネント](https://ui.shadcn.com/)
- [Redux Toolkit ドキュメント](https://redux-toolkit.js.org/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
