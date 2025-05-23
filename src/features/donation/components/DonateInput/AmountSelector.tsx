"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface AmountSelectorProps {
  onSelectAmount: (value: string) => void;
}

// 金額クイック選択コンポーネント
export const AmountSelector = React.memo(
  ({ onSelectAmount }: AmountSelectorProps) => {
    return (
      <div className="flex justify-between text-sm text-stone-600 px-1">
        <span>おすすめ金額:</span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
            onClick={() => onSelectAmount("1000")}
          >
            1,000円
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
            onClick={() => onSelectAmount("5000")}
          >
            5,000円
          </Button>
        </div>
      </div>
    );
  },
);

AmountSelector.displayName = "AmountSelector";
