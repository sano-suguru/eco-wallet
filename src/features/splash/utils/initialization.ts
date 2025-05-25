import { InitializationState } from "../types/splash";

/**
 * アプリケーションの初期化を行う
 * @returns 初期化の結果
 */
export async function initializeApp(): Promise<InitializationState> {
  const state: InitializationState = {
    authChecked: false,
    configLoaded: false,
    dataLoaded: false,
  };

  try {
    // 認証状態のチェック（NextAuthのセッション確認はコンポーネント側で行う）
    state.authChecked = true;

    // アプリ設定の読み込み
    await loadAppConfiguration();
    state.configLoaded = true;

    // 必要なデータの読み込み
    await loadInitialData();
    state.dataLoaded = true;

    return state;
  } catch (error) {
    return {
      ...state,
      error:
        error instanceof Error
          ? error.message
          : "初期化中にエラーが発生しました",
    };
  }
}

/**
 * アプリ設定を読み込む
 */
async function loadAppConfiguration(): Promise<void> {
  // 実際の実装では、APIからの設定取得やローカルストレージからの読み込みなどを行う
  // 現在はモックとして遅延を入れる
  await new Promise((resolve) => setTimeout(resolve, 200));
}

/**
 * 初期データを読み込む
 */
async function loadInitialData(): Promise<void> {
  // 実際の実装では、キャッシュデータの読み込みや初期APIコールなどを行う
  // 現在はモックとして遅延を入れる
  await new Promise((resolve) => setTimeout(resolve, 300));
}

/**
 * 最小表示時間を考慮した遅延を計算する
 * @param startTime 開始時刻
 * @param minimumTime 最小表示時間（ミリ秒）
 * @returns 追加で待機すべき時間（ミリ秒）
 */
export function calculateRemainingDelay(
  startTime: number,
  minimumTime: number,
): number {
  const elapsed = Date.now() - startTime;
  return Math.max(0, minimumTime - elapsed);
}

/**
 * リダイレクト先のパスを決定する
 * @param isAuthenticated ユーザーが認証済みか
 * @param intendedPath 意図されたパス（オプション）
 * @returns リダイレクト先のパス
 */
export function determineRedirectPath(
  isAuthenticated: boolean,
  intendedPath?: string,
): string {
  if (isAuthenticated) {
    return intendedPath || "/";
  }
  return "/auth/login";
}
