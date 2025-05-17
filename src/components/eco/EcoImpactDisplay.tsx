import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Leaf, TreePine, Droplets, Globe, ArrowRight } from "lucide-react";
import { calculateEcoImpact } from "@/lib/utils/eco-impact";

type EcoImpactVariant = "compact" | "detailed" | "transaction";

interface EcoImpactDisplayProps {
  contributionAmount: number;
  variant?: EcoImpactVariant;
  clickable?: boolean;
  className?: string;
}

export function EcoImpactDisplay({
  contributionAmount,
  variant = "detailed",
  clickable = false,
  className = "",
}: EcoImpactDisplayProps) {
  const { forestArea, waterSaved, co2Reduction } =
    calculateEcoImpact(contributionAmount);
  const impactPercent = Math.min(
    100,
    Math.round((contributionAmount / 1000) * 100),
  );
  const isCompact = variant === "compact";

  // 視覚的に強化されたコンテンツ
  const ecoContent = (
    <>
      {isCompact ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs">
            <Leaf className="h-3 w-3 mr-1 text-teal-600" />
            <span className="text-teal-700 font-medium">
              環境貢献：¥{contributionAmount}
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
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Leaf className="h-4 w-4 text-teal-600 mr-2" />
              <span className="text-sm font-medium text-teal-800">
                環境への貢献
              </span>
            </div>
            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
              ¥{contributionAmount.toLocaleString()}
            </span>
          </div>

          <div className="mt-3 text-xs text-teal-700">
            <div className="mt-1">
              <div className="flex justify-between text-xs mb-1">
                <span>環境貢献度</span>
                <span className="text-teal-600 font-medium">
                  {impactPercent}%
                </span>
              </div>
              <Progress value={impactPercent} className="h-1.5 bg-teal-100" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white bg-opacity-60 p-2 rounded-md text-center">
              <TreePine className="h-4 w-4 mx-auto text-teal-600 mb-1" />
              <p className="text-xs font-medium text-teal-800">
                {forestArea} m²
              </p>
              <p className="text-[10px] text-teal-600">森林保全</p>
            </div>

            <div className="bg-white bg-opacity-60 p-2 rounded-md text-center">
              <Droplets className="h-4 w-4 mx-auto text-blue-500 mb-1" />
              <p className="text-xs font-medium text-teal-800">
                {waterSaved} L
              </p>
              <p className="text-[10px] text-teal-600">水資源保全</p>
            </div>

            <div className="bg-white bg-opacity-60 p-2 rounded-md text-center">
              <Globe className="h-4 w-4 mx-auto text-green-600 mb-1" />
              <p className="text-xs font-medium text-teal-800">
                {co2Reduction} kg
              </p>
              <p className="text-[10px] text-teal-600">CO2削減</p>
            </div>
          </div>

          <p className="text-xs text-teal-700 mt-3 text-center">
            あなたの{contributionAmount}
            円の貢献が、地球環境の保全に繋がっています
          </p>
        </>
      )}
    </>
  );

  // コンテナクラスの設定
  // ガイドラインに準拠した色とトランジション効果
  const containerClass = cn(
    `${isCompact ? "p-2" : "p-4"} 
    bg-teal-50 border border-teal-100 rounded-md 
    eco-transition ${clickable ? "hover:bg-teal-100 hover:border-teal-200" : ""}`,
    className,
  );

  // クリック可能な場合はリンクでラップ
  if (clickable) {
    return (
      <Link href="/impact" className={containerClass}>
        {ecoContent}
      </Link>
    );
  }

  return (
    <div className={containerClass}>
      {ecoContent}
      {/* ボタンは詳細表示かつクリック不可の時のみ表示 */}
      {!isCompact && (
        <Link href="/impact" className="w-full block mt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-teal-700 border-teal-200 bg-white hover:bg-teal-50 eco-transition"
          >
            環境インパクト詳細を見る
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      )}
    </div>
  );
}
