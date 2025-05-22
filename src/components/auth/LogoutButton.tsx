// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import { LogoutButton as NewLogoutButton } from "@/features/auth/components/LogoutButton";

// 元のコンポーネントを再エクスポート
export function LogoutButton() {
  // デフォルトの設定で新しいコンポーネントを使用
  return <NewLogoutButton />;
}
