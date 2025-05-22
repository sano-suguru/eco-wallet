// ブリッジコンポーネント: このファイルは下位互換性のために維持されています
// 新しいバーティカルスライスアーキテクチャのコンポーネントを再エクスポート

import {
  BankTransferSection as NewBankTransferSection,
  BankTransferSectionProps,
} from "@/features/charge/components/BankTransferSection";

// 元のコンポーネントと同じインターフェイスを維持
export function BankTransferSection(props: BankTransferSectionProps) {
  // 新しいコンポーネントを使用
  return <NewBankTransferSection {...props} />;
}
