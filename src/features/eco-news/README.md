# eco-news Module

環境ニュースとプロジェクトの表示・管理を行うモジュール

## Overview

eco-newsモジュールは、環境に関するニュースやプロジェクトの情報を管理・表示する機能を提供します。

## Components

### NewsPage

- ニュース一覧ページの統合コンポーネント
- フィルタリング機能（すべて、ニュース、プロジェクト）
- 検索機能

### NewsDetailPage

- ニュース詳細ページの統合コンポーネント
- 共有機能
- 関連ニュース表示

### NewsList

- ニュース・プロジェクト一覧表示コンポーネント
- タブ切り替え機能
- 検索フィルター

### NewsDetail

- ニュース詳細表示コンポーネント
- 環境貢献情報表示

### RelatedNews

- 関連ニュース表示サブコンポーネント

## Types

- `ContentType`: "news" | "project"
- `ImageType`: "forest" | "ocean" | "mountain" | "default"
- `NewsItem`: ニュースアイテムの型定義
- `ProjectItem`: プロジェクトアイテムの型定義
- `ContentItem`: NewsItem | ProjectItem
- `StatusFilter`: "all" | "news" | "project"
- `NewsFilterState`: フィルター状態の型定義

## Hooks

### useNewsFilter

- ニュース/プロジェクトのフィルタリング機能
- 検索機能
- ステータスフィルター

## Data

### eco-news-data.ts

- モックデータ（ニュースとプロジェクト）

## Usage

```tsx
// ニュース一覧ページ
import { NewsPage } from "@/features/eco-news";

export default function EcoNewsRoute() {
  return <NewsPage />;
}

// ニュース詳細ページ
import { NewsDetailPage } from "@/features/eco-news";

export default function NewsDetailRoute() {
  return <NewsDetailPage />;
}
```

## Design Guidelines

- ティール（環境）とストーン（安定性）を基調色として使用
- 環境タイプに応じた背景グラデーション
  - 森林: ティール系
  - 海洋: ブルー系
  - 山岳: グリーン系
- shadcn/uiコンポーネントの活用
- レスポンシブデザイン対応
