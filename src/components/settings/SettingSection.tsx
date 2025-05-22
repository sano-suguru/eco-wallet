// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import {
  SettingSection as NewSettingSection,
  SettingSectionProps,
} from "@/features/settings";

// 元のコンポーネントと同じインターフェイスを維持
export function SettingSection(props: SettingSectionProps) {
  // 新しいコンポーネントを使用
  return <NewSettingSection {...props} />;
}
