// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import { CompactEcoImpact as NewCompactEcoImpact } from "@/features/eco-impact";

// 既存の型と同じインターフェイスを維持
interface CompactEcoImpactProps {
  contributionAmount: number;
  showBorder?: boolean;
  disableLink?: boolean;
  clickable?: boolean;
}

// 元のコンポーネントと同じインターフェイスを維持
export function CompactEcoImpact(props: CompactEcoImpactProps) {
  // 新しいコンポーネントを使用
  return <NewCompactEcoImpact {...props} />;
}
