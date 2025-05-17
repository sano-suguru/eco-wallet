// このファイルは下位互換性のために維持されています
// リファクタリングされたコンポーネントを再エクスポートします
import BalanceCardContainer from "./Balance";

// 既存のコンポーネント名を維持
export function BalanceCard() {
  return <BalanceCardContainer />;
}

// 既存のインポートをサポートするための再エクスポート
export default BalanceCard;
