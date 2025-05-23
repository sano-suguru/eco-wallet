"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Leaf } from "lucide-react";
import { TransactionStyle } from "@/features/transactions";

interface TransactionHeaderProps {
  description: string;
  date: string;
  badges?: string[];
  ecoEnabled?: boolean;
  style?: TransactionStyle;
  onBack: () => void;
}

// 取引詳細ヘッダー部分のプレゼンテーションコンポーネント
const TransactionHeader = React.memo(
  ({
    description,
    date,
    badges = [],
    ecoEnabled = false,
    style,
    onBack,
  }: TransactionHeaderProps) => {
    return (
      <>
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-600"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            取引履歴に戻る
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${style?.bgColor || "bg-stone-50"}`}
          >
            {style?.icon}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-stone-800">
              {description}
            </h1>
            <div className="flex items-center">
              <p className="text-xs text-stone-500">{date}</p>
              {ecoEnabled && (
                <Badge className="ml-2 bg-teal-100 text-teal-800 hover:bg-teal-200 text-xs">
                  <Leaf className="h-3 w-3 mr-1" /> 環境貢献
                </Badge>
              )}
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  },
);

TransactionHeader.displayName = "TransactionHeader";

export default TransactionHeader;
