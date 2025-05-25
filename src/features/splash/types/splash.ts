/**
 * スプラッシュ画面の表示状態
 */
export type SplashStatus = "loading" | "completed" | "error";

/**
 * スプラッシュ画面の設定
 */
export interface SplashConfig {
  /** 表示時間（ミリ秒） */
  displayDuration: number;
  /** 最小表示時間（ミリ秒） */
  minimumDisplayTime: number;
  /** アニメーションの有効/無効 */
  enableAnimation: boolean;
}

/**
 * 初期化状態
 */
export interface InitializationState {
  /** 認証チェック完了 */
  authChecked: boolean;
  /** アプリ設定の読み込み完了 */
  configLoaded: boolean;
  /** 必要なデータの読み込み完了 */
  dataLoaded: boolean;
  /** エラー情報 */
  error?: string;
}

/**
 * スプラッシュ画面のプロパティ
 */
export interface SplashScreenProps {
  /** カスタム設定 */
  config?: Partial<SplashConfig>;
  /** 初期化完了時のコールバック */
  onComplete?: () => void;
}

/**
 * デフォルトのスプラッシュ設定
 */
export const DEFAULT_SPLASH_CONFIG: SplashConfig = {
  displayDuration: 2000,
  minimumDisplayTime: 1000,
  enableAnimation: true,
};
