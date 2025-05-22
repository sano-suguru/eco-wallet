"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Trees, Info } from "lucide-react";

interface TransactionEcoInfoProps {
  forestArea: number;
  co2Reduction: number;
  onViewDetails: () => void;
}

export const TransactionEcoInfo = React.memo(
  ({ forestArea, co2Reduction, onViewDetails }: TransactionEcoInfoProps) => {
    return (
      <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden mt-4">
        <div className="p-5">
          <div className="flex items-center mb-3">
            <Leaf className="text-emerald-600 mr-2 h-5 w-5" />
            <h3 className="text-base font-medium text-emerald-800">環境貢献</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-stone-600 mb-1">森林保全面積</div>
              <div className="flex items-center">
                <Trees className="h-4 w-4 text-emerald-600 mr-1" />
                <span className="text-lg font-bold text-emerald-700">
                  {forestArea.toFixed(2)}m²
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-stone-600 mb-1">CO₂削減量</div>
              <div className="flex items-center">
                <Leaf className="h-4 w-4 text-emerald-600 mr-1" />
                <span className="text-lg font-bold text-emerald-700">
                  {co2Reduction.toFixed(2)}kg
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center border border-emerald-200 bg-white hover:bg-emerald-50"
            onClick={onViewDetails}
          >
            <Info className="h-4 w-4 mr-1 text-emerald-600" />
            <span className="text-emerald-700">環境貢献詳細を見る</span>
          </Button>
        </div>
      </Card>
    );
  },
);

TransactionEcoInfo.displayName = "TransactionEcoInfo";
