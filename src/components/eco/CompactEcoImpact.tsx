import { Leaf, TreePine, Globe } from "lucide-react";
import Link from "next/link";

interface CompactEcoImpactProps {
  contributionAmount: number;
  showBorder?: boolean;
  disableLink?: boolean;
}

export function CompactEcoImpact({
  contributionAmount,
  showBorder = true,
  disableLink = false, // デフォルトはfalse
}: CompactEcoImpactProps) {
  // 環境メトリクスの計算
  const forestArea = Number((contributionAmount * 0.0005).toFixed(1)); // 1000円で0.5㎡
  const co2Reduction = Number((contributionAmount * 0.0125).toFixed(1)); // 1000円で12.5kg

  // 内部コンテンツを返すコンポーネント
  const Content = () => (
    <span className="flex items-center text-xs text-teal-600">
      <Leaf className="h-3 w-3 mr-1 text-teal-600" />
      <span>
        寄付 ¥{contributionAmount} •
        <TreePine className="h-3 w-3 ml-1 mr-0.5 inline text-teal-600" />
        {forestArea}m² •
        <Globe className="h-3 w-3 ml-1 mr-0.5 inline text-green-600" />
        {co2Reduction}kg
      </span>
    </span>
  );

  // スタイルのクラス名
  const className = `
        flex items-center text-xs text-teal-600 p-1.5 rounded-md 
        ${showBorder ? "bg-teal-50 border border-teal-100" : ""}
    `;

  // disableLink プロパティに基づいて、リンクを無効にするかどうかを決定
  return disableLink ? (
    <div className={className}>
      <Content />
    </div>
  ) : (
    <Link href="/impact" className={className}>
      <Content />
    </Link>
  );
}
