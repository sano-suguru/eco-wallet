import { Leaf, TreePine, Droplets, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TransactionEcoImpactProps {
  contributionAmount: number;
  compact?: boolean;
  showLink?: boolean;
  className?: string;
}

export function TransactionEcoImpact({
  contributionAmount,
  compact = false,
  showLink = true,
  className = "",
}: TransactionEcoImpactProps) {
  // 環境メトリクスの計算
  const forestArea = Number((contributionAmount * 0.0005).toFixed(2)); // 1000円で0.5㎡
  const waterSaved = Math.round(contributionAmount * 0.25); // 1000円で250L
  const co2Reduction = Number((contributionAmount * 0.0125).toFixed(1)); // 1000円で12.5kg

  // ユーザーの寄付額に基づくパーセンテージ (例: 0-1000円で0-100%)
  const impactPercent = Math.min(
    100,
    Math.round((contributionAmount / 1000) * 100),
  );

  return (
    <div
      className={`${compact ? "p-3" : "p-4"} bg-teal-50 rounded-md border border-teal-100 ${className}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Leaf className="h-4 w-4 text-teal-600 mr-2" />
          <span
            className={`${compact ? "text-xs" : "text-sm font-medium"} text-teal-800`}
          >
            環境への貢献
          </span>
        </div>

        {showLink && !compact && (
          <Link href="/impact">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-teal-700"
            >
              詳細を見る
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-3 text-xs text-teal-700">
        <p>寄付金額: ¥{contributionAmount.toLocaleString()}</p>
        <div className="mt-1">
          <div className="flex justify-between text-xs mb-1">
            <span>環境貢献度</span>
            <span className="text-teal-600 font-medium">{impactPercent}%</span>
          </div>
          <Progress value={impactPercent} className="h-1.5 bg-teal-100" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-white bg-opacity-60 p-2 rounded-md text-center">
          <TreePine className="h-4 w-4 mx-auto text-teal-600 mb-1" />
          <p className="text-xs font-medium text-teal-800">{forestArea} m²</p>
          <p className="text-[10px] text-teal-600">森林保全</p>
        </div>

        <div className="bg-white bg-opacity-60 p-2 rounded-md text-center">
          <Droplets className="h-4 w-4 mx-auto text-blue-500 mb-1" />
          <p className="text-xs font-medium text-teal-800">{waterSaved} L</p>
          <p className="text-[10px] text-teal-600">水資源保全</p>
        </div>

        <div className="bg-white bg-opacity-60 p-2 rounded-md text-center">
          <Globe className="h-4 w-4 mx-auto text-green-600 mb-1" />
          <p className="text-xs font-medium text-teal-800">{co2Reduction} kg</p>
          <p className="text-[10px] text-teal-600">CO2削減</p>
        </div>
      </div>

      {!compact && (
        <>
          <p className="text-xs text-teal-700 mt-3 text-center">
            あなたの{contributionAmount}
            円の貢献が、地球環境の保全に繋がっています
          </p>

          {showLink && (
            <Link href="/impact" className="w-full block mt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-teal-700 border-teal-200 bg-white hover:bg-teal-50"
              >
                環境インパクト詳細を見る
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
