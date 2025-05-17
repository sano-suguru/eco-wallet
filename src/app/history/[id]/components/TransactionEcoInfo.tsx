"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TransactionEcoInfoProps {
  forestArea: number;
  co2Reduction: number;
  onViewDetails: () => void;
}

// 環境貢献のサマリーを表示するコンポーネント
const TransactionEcoInfo = React.memo(
  ({ forestArea, co2Reduction, onViewDetails }: TransactionEcoInfoProps) => {
    return (
      <div className="mt-4">
        <Card className="border-0 shadow-md bg-white p-4">
          <h3 className="text-sm font-medium text-stone-800 mb-2">
            環境インパクトの詳細
          </h3>
          <p className="text-xs text-stone-600 mb-3">これまでの累計環境貢献</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-stone-50 p-2 rounded-md text-center">
              <p className="text-xs text-stone-600">森林保全</p>
              <p className="text-sm font-medium text-stone-800">
                {forestArea} m²
              </p>
            </div>
            <div className="bg-stone-50 p-2 rounded-md text-center">
              <p className="text-xs text-stone-600">CO2削減</p>
              <p className="text-sm font-medium text-stone-800">
                {co2Reduction} kg
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-teal-700 border-teal-200 hover:bg-teal-50 text-xs"
            onClick={onViewDetails}
          >
            環境貢献の詳細を見る
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Card>
      </div>
    );
  },
);

TransactionEcoInfo.displayName = "TransactionEcoInfo";

export default TransactionEcoInfo;
