// このファイルは下位互換性のために維持されています
// リファクタリングされたコンポーネントを再エクスポートします
import { TransactionEcoImpact as NewTransactionEcoImpact } from "@/features/eco-impact";

interface TransactionEcoImpactProps {
  contributionAmount: number;
  compact?: boolean;
  clickable?: boolean;
  className?: string;
}

export function TransactionEcoImpact(props: TransactionEcoImpactProps) {
  // 新しいコンポーネントを使用
  return <NewTransactionEcoImpact {...props} />;
}
