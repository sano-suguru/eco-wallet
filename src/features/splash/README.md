# Splash Feature Module

スプラッシュ画面機能を提供するfeatureモジュールです。アプリケーション起動時の初期化処理とブランディング表示を担当します。

## 概要

このモジュールは以下の機能を提供します：

- アプリケーション起動時のスプラッシュ画面表示
- 認証状態のチェックと適切なリダイレクト
- 初期化処理の進行状況表示
- ブランドロゴとアニメーション

## ディレクトリ構造

```
features/splash/
├── components/
│   ├── BrandLogo/          # ブランドロゴ表示
│   ├── InitializationStatus/ # 初期化状態表示
│   └── SplashScreen/       # メインスプラッシュ画面
├── hooks/
│   └── useSplashScreen.ts  # スプラッシュ画面制御フック
├── types/
│   └── splash.ts           # 型定義
├── utils/
│   └── initialization.ts   # 初期化ユーティリティ
├── README.md              # このファイル
└── index.ts               # パブリックAPI
```

## 使用方法

### 基本的な使用

```tsx
import { SplashScreen } from "@/features/splash";

export default function SplashPage() {
  return <SplashScreen />;
}
```

### カスタム設定での使用

```tsx
import { SplashScreen } from "@/features/splash";

export default function SplashPage() {
  const config = {
    displayDuration: 3000, // 3秒表示
    minimumDisplayTime: 1500, // 最小1.5秒表示
    enableAnimation: true, // アニメーション有効
  };

  const handleComplete = () => {
    console.log("Splash screen completed");
  };

  return <SplashScreen config={config} onComplete={handleComplete} />;
}
```

## コンポーネント

### SplashScreen

メインのスプラッシュ画面コンポーネント。

**Props:**

- `config?: Partial<SplashConfig>` - スプラッシュ画面の設定
- `onComplete?: () => void` - 初期化完了時のコールバック

### BrandLogo

Eco Walletのブランドロゴコンポーネント。

**Props:**

- `size?: 'small' | 'medium' | 'large'` - ロゴのサイズ
- `animate?: boolean` - アニメーションの有効/無効
- `className?: string` - カスタムクラス名

### InitializationStatus

初期化状態を表示するコンポーネント。

**Props:**

- `state: InitializationState` - 初期化状態
- `showError?: boolean` - エラー表示の有無

## フック

### useSplashScreen

スプラッシュ画面の制御を行うカスタムフック。

```tsx
const { status, initializationState, isAnimationEnabled } =
  useSplashScreen(config);
```

**戻り値:**

- `status: SplashStatus` - スプラッシュ画面の状態
- `initializationState: InitializationState` - 初期化の詳細状態
- `isAnimationEnabled: boolean` - アニメーションの有効状態

## 型定義

### SplashConfig

```typescript
interface SplashConfig {
  displayDuration: number; // 表示時間（ミリ秒）
  minimumDisplayTime: number; // 最小表示時間（ミリ秒）
  enableAnimation: boolean; // アニメーションの有効/無効
}
```

### InitializationState

```typescript
interface InitializationState {
  authChecked: boolean; // 認証チェック完了
  configLoaded: boolean; // アプリ設定の読み込み完了
  dataLoaded: boolean; // 必要なデータの読み込み完了
  error?: string; // エラー情報
}
```

## 初期化フロー

1. **認証状態の確認** - NextAuthのセッション状態を確認
2. **アプリ設定の読み込み** - 必要な設定を読み込み
3. **初期データの読み込み** - キャッシュデータなどを読み込み
4. **リダイレクト処理** - 認証状態に基づいて適切な画面へ遷移

## カスタマイズ

### 初期化処理の拡張

`utils/initialization.ts`の`initializeApp`関数を修正して、独自の初期化処理を追加できます：

```typescript
// 例：APIからの初期データ取得
async function loadInitialData(): Promise<void> {
  const response = await fetch("/api/initial-data");
  const data = await response.json();
  // データの処理
}
```

### スタイルのカスタマイズ

各コンポーネントはTailwind CSSクラスを使用しています。必要に応じてクラスを調整してください。

## 注意事項

- スプラッシュ画面は最小表示時間を設定することで、高速な初期化時でも適切なブランディング表示を確保します
- エラー発生時は自動的にエラー表示モードに切り替わります
- 認証状態に基づいて自動的にリダイレクト処理を行います
