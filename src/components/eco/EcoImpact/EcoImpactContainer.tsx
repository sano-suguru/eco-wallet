"use client";

import { useEcoImpact } from "@/hooks";
import EcoImpactDisplay, { EcoImpactData } from "./EcoImpactDisplay";

interface EcoImpactContainerProps {
  contributionAmount: number;
  variant?: "compact" | "detailed" | "transaction";
  clickable?: boolean;
  className?: string;
}

// コンテナコンポーネント: データ取得とビジネスロジックを担当
export default function EcoImpactContainer({
  contributionAmount,
  variant = "detailed",
  clickable = false,
  className = "",
}: EcoImpactContainerProps) {
  // 環境インパクト情報をフックから取得
  const {
    forestArea,
    waterSaved,
    co2Reduction,
    impactPercent,
    totalContribution,
  } = useEcoImpact(contributionAmount);

  // プレゼンテーションコンポーネントに渡すデータを構築
  const ecoImpactData: EcoImpactData = {
    contributionAmount: contributionAmount || totalContribution,
    forestArea,
    waterSaved,
    co2Reduction,
    impactPercent,
  };

  // データを表示コンポーネントに渡すだけ
  return (
    <EcoImpactDisplay
      data={ecoImpactData}
      variant={variant}
      clickable={clickable}
      className={className}
    />
  );
}
