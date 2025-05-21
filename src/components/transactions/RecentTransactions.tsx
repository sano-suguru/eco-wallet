// このファイルは下位互換性のために維持されています
// リファクタリングされたコンポーネントを再エクスポートします
import { RecentTransactionsContainer } from "@/features/transactions";

// 既存のインターフェースを維持
interface RecentTransactionsProps {
  limit?: number;
  showHeader?: boolean;
}

// 元のコンポーネントと同じインターフェースを維持
export function RecentTransactions({
  limit = 3,
  showHeader = true,
}: RecentTransactionsProps) {
  // リファクタリングされたコンテナコンポーネントを使用
  return <RecentTransactionsContainer limit={limit} showHeader={showHeader} />;
}

// 既存のインポートをサポートするための再エクスポート
export default RecentTransactions;
