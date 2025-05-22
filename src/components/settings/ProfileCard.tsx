// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import {
  ProfileCard as NewProfileCard,
  ProfileCardProps,
} from "@/features/settings";

// 元のコンポーネントと同じインターフェイスを維持
export function ProfileCard(props: ProfileCardProps) {
  // 新しいコンポーネントを使用
  return <NewProfileCard {...props} />;
}
