// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import {
  SocialShareButtons as NewSocialShareButtons,
  SocialShareButtonsProps,
} from "@/features/invite";

// 元のコンポーネントと同じインターフェイスを維持
export function SocialShareButtons(props: SocialShareButtonsProps) {
  // 新しいコンポーネントを使用
  return <NewSocialShareButtons {...props} />;
}
