"use client";

import React from "react";
import { generateBarcodeNumber } from "../../utils/qrcode-utils";

interface BarCodeDisplayProps {
  value?: string;
  prefix?: string;
  showLabel?: boolean;
  className?: string;
}

export const BarCodeDisplay: React.FC<BarCodeDisplayProps> = ({
  value,
  prefix = "8945",
  showLabel = true,
  className = "",
}) => {
  const barcodeNumber = value || generateBarcodeNumber(prefix);

  return (
    <div className={`p-4 bg-white flex flex-col items-center ${className}`}>
      {showLabel && (
        <p className="text-xs text-stone-600 mb-2">
          バーコード (店舗によって異なります)
        </p>
      )}
      <div className="bg-white py-2 px-4 w-full border border-stone-100 rounded-md">
        <svg viewBox="0 0 200 50" className="w-full h-12">
          {/* バーコードのバーを生成 */}
          <rect x="10" y="5" width="2" height="40" fill="black" />
          <rect x="15" y="5" width="1" height="40" fill="black" />
          <rect x="20" y="5" width="3" height="40" fill="black" />
          <rect x="25" y="5" width="1" height="40" fill="black" />
          <rect x="30" y="5" width="2" height="40" fill="black" />
          <rect x="36" y="5" width="4" height="40" fill="black" />
          <rect x="42" y="5" width="1" height="40" fill="black" />
          <rect x="46" y="5" width="2" height="40" fill="black" />
          <rect x="52" y="5" width="3" height="40" fill="black" />
          <rect x="58" y="5" width="1" height="40" fill="black" />
          <rect x="62" y="5" width="4" height="40" fill="black" />
          <rect x="70" y="5" width="2" height="40" fill="black" />
          <rect x="76" y="5" width="3" height="40" fill="black" />
          <rect x="82" y="5" width="1" height="40" fill="black" />
          <rect x="86" y="5" width="2" height="40" fill="black" />
          <rect x="92" y="5" width="1" height="40" fill="black" />
          <rect x="96" y="5" width="4" height="40" fill="black" />
          <rect x="104" y="5" width="2" height="40" fill="black" />
          <rect x="110" y="5" width="3" height="40" fill="black" />
          <rect x="116" y="5" width="1" height="40" fill="black" />
          <rect x="120" y="5" width="4" height="40" fill="black" />
          <rect x="126" y="5" width="2" height="40" fill="black" />
          <rect x="132" y="5" width="1" height="40" fill="black" />
          <rect x="136" y="5" width="3" height="40" fill="black" />
          <rect x="142" y="5" width="2" height="40" fill="black" />
          <rect x="146" y="5" width="3" height="40" fill="black" />
          <rect x="152" y="5" width="2" height="40" fill="black" />
          <rect x="158" y="5" width="1" height="40" fill="black" />
          <rect x="162" y="5" width="4" height="40" fill="black" />
          <rect x="170" y="5" width="2" height="40" fill="black" />
          <rect x="176" y="5" width="1" height="40" fill="black" />
          <rect x="180" y="5" width="3" height="40" fill="black" />
          <rect x="186" y="5" width="2" height="40" fill="black" />
        </svg>
        <p className="text-xs text-center mt-1 font-mono text-stone-600">
          {barcodeNumber}
        </p>
      </div>
    </div>
  );
};
