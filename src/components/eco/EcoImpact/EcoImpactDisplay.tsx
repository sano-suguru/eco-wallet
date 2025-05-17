"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CompactView from "./CompactView";
import DetailedView from "./DetailedView";

export interface EcoImpactData {
  contributionAmount: number;
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
  impactPercent: number;
}

interface EcoImpactDisplayProps {
  data: EcoImpactData;
  variant: "compact" | "detailed" | "transaction";
  clickable?: boolean;
  className?: string;
}

// プレゼンテーションコンポーネント：データを受け取って表示するだけ
const EcoImpactDisplay = React.memo(
  ({
    data,
    variant = "detailed",
    clickable = false,
    className = "",
  }: EcoImpactDisplayProps) => {
    const isCompact = variant === "compact";

    // コンテナクラスの設定
    const containerClass = cn(
      `${isCompact ? "p-2" : "p-4"} 
     bg-teal-50 border border-teal-100 rounded-md 
     eco-transition ${clickable ? "hover:bg-teal-100 hover:border-teal-200" : ""}`,
      className,
    );

    // コンテンツの用意（バリアントに応じた適切なビューを表示）
    const content = isCompact ? (
      <CompactView
        contributionAmount={data.contributionAmount}
        forestArea={data.forestArea}
        co2Reduction={data.co2Reduction}
      />
    ) : (
      <DetailedView
        contributionAmount={data.contributionAmount}
        forestArea={data.forestArea}
        waterSaved={data.waterSaved}
        co2Reduction={data.co2Reduction}
        impactPercent={data.impactPercent}
        showButton={!clickable} // クリック可能な場合はボタンを非表示
      />
    );

    // クリック可能な場合はリンクでラップ
    if (clickable) {
      return (
        <Link href="/impact" className={containerClass}>
          {content}
        </Link>
      );
    }

    // 通常の表示
    return <div className={containerClass}>{content}</div>;
  },
);

EcoImpactDisplay.displayName = "EcoImpactDisplay";

export default EcoImpactDisplay;
