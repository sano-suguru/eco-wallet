"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Leaf, TreePine, Droplets, Wind } from "lucide-react";
import { useEcoImpact } from "../../hooks/useEcoImpact";

interface CompactEcoImpactProps {
  contributionAmount: number;
  showBorder?: boolean;
  // 互換性のために残しておくが、内部では clickable に変換
  disableLink?: boolean;
  // 新しいプロパティも追加（オプション）
  clickable?: boolean;
  className?: string;
}

/**
 * コンパクトな環境貢献表示コンポーネント
 */
export function CompactEcoImpact({
  contributionAmount,
  showBorder = true,
  disableLink = false,
  // clickable プロパティが明示的に指定されていればそれを使用
  clickable,
  className = "",
}: CompactEcoImpactProps) {
  // clickable が明示的に指定されていればそれを使い、
  // そうでなければ disableLink の反対の値を使用
  const isClickable = clickable !== undefined ? clickable : !disableLink;

  // 環境貢献計算カスタムフックを使用
  const { forestArea, waterSaved, co2Reduction, impactPercent } =
    useEcoImpact(contributionAmount);

  // カード内のコンテンツを作成
  const content = (
    <div className={`relative ${className}`}>
      <div className="p-3 rounded-lg">
        <div className="flex items-center mb-2 text-teal-700">
          <Leaf className="h-4 w-4 mr-1" />
          <h3 className="text-sm font-medium">環境への貢献</h3>
        </div>

        <Progress value={impactPercent} className="h-1.5 mb-3" />

        <div className="grid grid-cols-3 gap-1 text-xs">
          <div className="flex flex-col items-center bg-teal-50 p-1.5 rounded">
            <TreePine className="h-3.5 w-3.5 text-teal-600 mb-1" />
            <div className="font-medium text-teal-900">{forestArea} m²</div>
            <div className="text-[10px] text-teal-600">森林保全</div>
          </div>

          <div className="flex flex-col items-center bg-blue-50 p-1.5 rounded">
            <Droplets className="h-3.5 w-3.5 text-blue-600 mb-1" />
            <div className="font-medium text-blue-900">{waterSaved} L</div>
            <div className="text-[10px] text-blue-600">水資源節約</div>
          </div>

          <div className="flex flex-col items-center bg-green-50 p-1.5 rounded">
            <Wind className="h-3.5 w-3.5 text-green-600 mb-1" />
            <div className="font-medium text-green-900">{co2Reduction} kg</div>
            <div className="text-[10px] text-green-600">CO2削減</div>
          </div>
        </div>
      </div>
    </div>
  );

  // リンクとして表示するかどうかで分岐
  if (isClickable) {
    return (
      <Link href="/impact">
        <Card
          className={`hover:shadow-md transition-shadow ${!showBorder ? "border-0 shadow-none" : ""}`}
        >
          {content}
        </Card>
      </Link>
    );
  }

  // クリック不可の場合はシンプルなカード
  return (
    <Card className={!showBorder ? "border-0 shadow-none" : ""}>{content}</Card>
  );
}
