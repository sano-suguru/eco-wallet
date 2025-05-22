// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import { PageHeader as NewPageHeader } from "@/features/settings";

// 元のコンポーネントと同じインターフェイスを維持
export function PageHeader() {
  // 新しいコンポーネントを使用
  return <NewPageHeader />;
}
