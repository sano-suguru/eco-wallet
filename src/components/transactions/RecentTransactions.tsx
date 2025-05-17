// このファイルは下位互換性のために維持されています
// リファクタリングされたコンポーネントを再エクスポートします
import RecentTransactionsContainer from "./RecentTransactions/RecentTransactionsContainer";

// 既存のインターフェースを維持
interface RecentTransactionsProps {
  limit?: number;
}

// 元のコンポーネントと同じインターフェースを維持
export function RecentTransactions({ limit = 3 }: RecentTransactionsProps) {
  // リファクタリングされたコンテナコンポーネントを使用
  return <RecentTransactionsContainer limit={limit} />;
}

// 既存のインポートをサポートするための再エクスポート
export default RecentTransactions;
