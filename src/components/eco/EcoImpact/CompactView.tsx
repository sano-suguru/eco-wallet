"use client";

import React from "react";
import { Leaf, TreePine, Globe } from "lucide-react";

// コンポーネントが受け取るデータの型定義
interface CompactViewProps {
  contributionAmount: number;
  forestArea: number;
  co2Reduction: number;
}

// プレゼンテーションコンポーネント：表示のみを担当
const CompactView = React.memo(
  ({ contributionAmount, forestArea, co2Reduction }: CompactViewProps) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs">
          <Leaf className="h-3 w-3 mr-1 text-teal-600" />
          <span className="text-teal-700 font-medium">
            環境貢献：¥{contributionAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center text-xs text-teal-700 space-x-2">
          <div className="flex items-center">
            <TreePine className="h-3 w-3 mr-0.5 text-teal-600" />
            <span>{forestArea}m²</span>
          </div>
          <div className="flex items-center">
            <Globe className="h-3 w-3 mr-0.5 text-green-600" />
            <span>{co2Reduction}kg</span>
          </div>
        </div>
      </div>
    );
  },
);

// 名前付きエクスポート用にcompDisplayNameを設定
CompactView.displayName = "CompactView";

export default CompactView;
