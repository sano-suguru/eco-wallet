// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import { BalanceCardContainer } from "@/features/balance/components/BalanceCard";

// 元のコンポーネントと同じインターフェイスで、新しいコンポーネントを再エクスポート
export default function BalanceCard({ className }: { className?: string }) {
  // 新しいコンポーネントを使用
  return <BalanceCardContainer className={className} />;
}

// 以前のコンポーネントも必要に応じてエクスポート
export { BalanceCardContainer };
