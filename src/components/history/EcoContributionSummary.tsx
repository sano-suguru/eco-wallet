"use client";

import { Leaf } from "lucide-react";

interface EcoContributionSummaryProps {
  totalDonation?: number;
  forestArea?: number;
  co2Reduction?: number;
}

export function EcoContributionSummary({
  totalDonation = 12450,
  forestArea = 5,
  co2Reduction = 25,
}: EcoContributionSummaryProps) {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-md p-3">
      <div className="flex items-start space-x-3">
        <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-teal-800">
            あなたの環境への貢献
          </h4>
          <p className="text-xs text-teal-700 mt-1">
            これまでの累計寄付額：¥{totalDonation.toLocaleString()}
          </p>
          <p className="text-xs text-teal-700 mt-1">
            あなたの取引によって保全された森林面積：{forestArea}平方メートル
          </p>
          <p className="text-xs text-teal-700 mt-1">
            削減されたCO2排出量：{co2Reduction}kg
          </p>
        </div>
      </div>
    </div>
  );
}

export default EcoContributionSummary;
