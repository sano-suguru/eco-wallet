import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, TreePine, Droplets, Globe, ChevronRight } from "lucide-react";

interface EcoImpactProps {
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
  progressPercent: number;
  ecoRank?: string;
}

export function EcoImpactCard({
  forestArea,
  waterSaved,
  co2Reduction,
  progressPercent,
  ecoRank = "エコマイスター",
}: EcoImpactProps) {
  return (
    <Card className="border-0 shadow-md bg-white p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-stone-800 flex items-center">
          <Leaf className="h-4 w-4 mr-1 text-teal-600" />
          あなたの環境貢献
        </h3>
        {ecoRank && (
          <Badge className="bg-teal-100 text-teal-800">{ecoRank}</Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-stone-50 p-2 rounded-md text-center">
          <div className="flex justify-center mb-1">
            <TreePine className="h-5 w-5 text-teal-600" />
          </div>
          <p className="text-xs text-stone-600">森林保全</p>
          <p className="text-sm font-medium text-stone-800">{forestArea} m²</p>
        </div>
        <div className="bg-stone-50 p-2 rounded-md text-center">
          <div className="flex justify-center mb-1">
            <Droplets className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-xs text-stone-600">水資源保全</p>
          <p className="text-sm font-medium text-stone-800">{waterSaved} L</p>
        </div>
        <div className="bg-stone-50 p-2 rounded-md text-center">
          <div className="flex justify-center mb-1">
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-xs text-stone-600">CO2削減</p>
          <p className="text-sm font-medium text-stone-800">
            {co2Reduction} kg
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-stone-600">目標達成度</span>
          <span className="text-teal-600 font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      <Link href="/impact">
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs border-stone-200 text-teal-700"
        >
          詳細を見る
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </Link>
    </Card>
  );
}
