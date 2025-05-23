// このファイルは下位互換性のために維持されています
// リファクタリングされたコンポーネントを再エクスポートします
import { EcoImpactDisplay as NewEcoImpactDisplay } from "@/features/eco-impact";

// 型定義の再利用
type EcoImpactVariant = "compact" | "detailed" | "transaction";

interface EcoImpactDisplayProps {
  contributionAmount: number;
  variant?: EcoImpactVariant;
  clickable?: boolean;
  className?: string;
}

export function EcoImpactDisplay(props: EcoImpactDisplayProps) {
  // 新しいコンポーネントを使用
  return <NewEcoImpactDisplay {...props} />;
}

// 既存のインポートをサポートするための再エクスポート
export default EcoImpactDisplay;
