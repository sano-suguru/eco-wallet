import React from "react";
import { Leaf } from "lucide-react";
import { InitializationState } from "../../types/splash";

interface InitializationStatusProps {
  /** 初期化状態 */
  state: InitializationState;
  /** エラー時の表示有無 */
  showError?: boolean;
}

/**
 * 初期化状態を表示するコンポーネント
 */
export function InitializationStatus({
  state,
  showError = true,
}: InitializationStatusProps) {
  const getStatusText = (): string => {
    if (state.error && showError) {
      return "初期化エラー";
    }
    if (state.dataLoaded) {
      return "初期化完了";
    }
    if (state.configLoaded) {
      return "データ読み込み中...";
    }
    if (state.authChecked) {
      return "設定を読み込み中...";
    }
    return "認証確認中...";
  };

  const getProgress = (): number => {
    if (state.error) return 0;
    let progress = 0;
    if (state.authChecked) progress += 33;
    if (state.configLoaded) progress += 33;
    if (state.dataLoaded) progress += 34;
    return progress;
  };

  return (
    <div className="mt-8 w-64">
      {/* プログレスバー */}
      <div className="w-full bg-teal-900 rounded-full h-1.5 mb-4">
        <div
          className="bg-teal-300 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* ステータステキスト */}
      <p className="text-teal-100 text-sm text-center">{getStatusText()}</p>

      {/* エラー詳細 */}
      {state.error && showError && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-xs">{state.error}</p>
        </div>
      )}

      {/* エコメッセージ */}
      {!state.error && (
        <div className="absolute bottom-10 flex items-center text-teal-100 text-sm">
          <Leaf className="h-4 w-4 mr-2" />
          <span>環境と共に、持続可能な未来へ</span>
        </div>
      )}
    </div>
  );
}
