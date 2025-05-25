# Eco Wallet ドキュメント

## 概要

このディレクトリには、Eco Walletプロジェクトの技術ドキュメントが含まれています。

## ドキュメント一覧

### アーキテクチャ (`architecture/`)

- **[overview.md](architecture/overview.md)** - 現在のアーキテクチャ概要

  - バーティカルスライスアーキテクチャの説明
  - 17個のfeatureモジュールの一覧と責務
  - ディレクトリ構造と設計原則

- **[development-guide.md](architecture/development-guide.md)** - 開発ガイド

  - 新機能の追加方法
  - 既存機能の修正方法
  - コーディング規約とベストプラクティス
  - テスト方針とパフォーマンス最適化

- **[cline-development-guide.md](architecture/cline-development-guide.md)** - Cline開発ガイド
  - TypeScript特化プロンプトエンジニアリング
  - 効果的なプロンプトパターン（TDD、In Source Testing等）
  - アンチパターンと回避方法
  - Eco Wallet固有の適用方法

### デザイン (`design/`)

- **[design-guideline.md](design/design-guideline.md)** - デザインガイドライン
  - ブランドの理念と価値観
  - カラーパレットとタイポグラフィ
  - コンポーネントデザイン仕様
  - 画面別デザインガイドライン
  - アクセシビリティとレスポンシブデザイン

## クイックリンク

- [プロジェクトの構造を理解する](architecture/overview.md)
- [新機能を追加する](architecture/development-guide.md#新機能の追加)
- [デザインシステムを確認する](design/design-guideline.md#2-ビジュアルデザイン要素)

## プロジェクト情報

- **フレームワーク**: Next.js 14 (App Router)
- **UI ライブラリ**: React 18, Tailwind CSS, shadcn/ui
- **状態管理**: Redux Toolkit
- **アーキテクチャ**: バーティカルスライスアーキテクチャ

## 更新履歴

- 2025/01/25 - ドキュメントの整理・統合を実施
- 2025/01/25 - Cline開発ガイドを追加（TypeScript特化プロンプトエンジニアリング）
