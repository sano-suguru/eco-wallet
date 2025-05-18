"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, TreePine, Droplets, Globe, ChevronRight } from "lucide-react";
import { useEcoImpactStore } from "@/stores/slices/ecoImpact";
import { useTransactionStore } from "@/stores/slices/transaction";
import { useEffect } from "react";

import { formatCurrency } from "@/lib/utils/common";

interface EcoImpactProps {
  ecoRank?: string;
}

export function EcoImpactCard({ ecoRank }: EcoImpactProps) {
  const {
    forestArea,
    waterSaved,
    co2Reduction,
    progressPercent,
    updateProgress,
    getEcoRank,
  } = useEcoImpactStore();

  // 環境貢献合計額をトランザクションストアから取得
  const getTotalEcoContribution = useTransactionStore(
    (state) => state.getTotalEcoContribution,
  );

  // コンポーネントマウント時に進捗を更新
  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  // ランクが明示的に提供されなければ、ストアから取得
  const displayEcoRank = ecoRank || getEcoRank();

  // トランザクションストアから合計貢献額を取得
  const totalEcoContribution = getTotalEcoContribution();

  return (
    <Card className="border-0 shadow-md bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-stone-800 flex items-center">
          <Leaf className="h-4 w-4 mr-1 text-teal-600" />
          あなたの環境貢献
        </h3>
        {displayEcoRank && (
          <Badge className="bg-teal-100 text-teal-700 rounded-full text-xs font-medium px-2 py-0.5 border-0">
            {displayEcoRank}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-teal-100 p-2 rounded-md text-center">
          <div className="flex justify-center mb-1">
            <TreePine className="h-5 w-5 text-teal-600" />
          </div>
          <p className="text-xs text-stone-600">森林保全</p>
          <p className="text-sm font-medium text-teal-700">{forestArea} m²</p>
        </div>
        <div className="bg-teal-100 p-2 rounded-md text-center">
          <div className="flex justify-center mb-1">
            <Droplets className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-xs text-stone-600">水資源保全</p>
          <p className="text-sm font-medium text-blue-600">{waterSaved} L</p>
        </div>
        <div className="bg-teal-100 p-2 rounded-md text-center">
          <div className="flex justify-center mb-1">
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-xs text-stone-600">CO2削減</p>
          <p className="text-sm font-medium text-green-600">
            {co2Reduction} kg
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-stone-600">目標達成度</span>
          <span className="text-teal-600 font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-stone-100" />
      </div>

      {totalEcoContribution > 0 && (
        <div className="mt-3 text-xs text-center bg-teal-100 text-teal-700 py-2 px-3 rounded-md">
          累計環境貢献額: {formatCurrency(totalEcoContribution)}
        </div>
      )}

      <Link href="/impact">
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs border-stone-200 text-teal-600 hover:bg-teal-100 hover:text-teal-700 rounded-md"
        >
          詳細を見る
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </Link>
    </Card>
  );
}
