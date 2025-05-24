import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Trees, Users } from "lucide-react";
import { useEcoImpactStore } from "@/features/eco-impact/store/eco-impact.slice";
import { formatCurrency } from "@/shared/utils/formats";

export function EcoContributionSummary() {
  const { totalDonation, forestArea, co2Reduction } = useEcoImpactStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          環境貢献サマリー
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-muted-foreground">総貢献額</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalDonation)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Trees className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">植樹本数</p>
                <p className="text-lg font-semibold">
                  {Math.floor(forestArea)}本
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CO₂削減量</p>
                <p className="text-lg font-semibold">
                  {co2Reduction.toFixed(1)}kg
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700">
              これまでの環境貢献により、{Math.floor(forestArea * 0.3)}人分の
              年間CO₂排出量を相殺しました
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
