// このファイルは下位互換性のために維持されています
// リファクタリングされたコンポーネントを再エクスポートします
import { NewsAndProjects as NewNewsAndProjects } from "@/features/eco-impact";

export function NewsAndProjects() {
  // 新しいコンポーネントを使用
  return <NewNewsAndProjects />;
}

// 既存のインポートをサポートするための再エクスポート
export default NewsAndProjects;
