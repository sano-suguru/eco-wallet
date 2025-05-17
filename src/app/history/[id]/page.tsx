"use client";

import TransactionDetailContainer from "./components/TransactionDetailContainer";

// 取引詳細ページのエントリーポイント
// リファクタリングの一環として、コンテナコンポーネントと表示コンポーネントを分離
export default function TransactionDetailPage() {
  // ロジックとデータ処理はすべてTransactionDetailContainerに移譲
  return <TransactionDetailContainer />;
}
