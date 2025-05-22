"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransactionStyle } from "@/features/transactions";

interface TransactionHeaderProps {
  description: string;
  date: string;
  badges?: string[];
  ecoEnabled?: boolean;
  style?: TransactionStyle;
  onBack: () => void;
}

export const TransactionHeader = React.memo(
  ({
    description,
    date,
    badges = [],
    ecoEnabled = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    style,
    onBack,
  }: TransactionHeaderProps) => {
    return (
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="pl-0 mb-3 text-stone-600"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          履歴に戻る
        </Button>

        <div className="flex justify-between">
          <h1 className="text-xl font-bold text-stone-800 mb-1 truncate">
            {description}
          </h1>
        </div>

        <div className="flex items-center text-sm text-stone-600 mb-2">
          <span>{date}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {badges.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className={`text-xs font-medium ${
                badge === "環境貢献" && ecoEnabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-stone-50"
              }`}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    );
  },
);

TransactionHeader.displayName = "TransactionHeader";
