// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import {
  QRCodeDisplay as NewQRCodeDisplay,
  QRCodeDisplayProps,
} from "@/features/invite";

// 元のコンポーネントと同じインターフェイスを維持
export function QRCodeDisplay(props: QRCodeDisplayProps) {
  // 新しいコンポーネントを使用
  return <NewQRCodeDisplay {...props} />;
}
