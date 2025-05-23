"use client";

import React from "react";
import { EcoImpactDisplay } from "../EcoImpact/EcoImpactDisplay";

interface TransactionEcoImpactProps {
  contributionAmount: number;
  compact?: boolean;
  clickable?: boolean;
  className?: string;
}

export function TransactionEcoImpact({
  contributionAmount,
  compact = false,
  clickable = false,
  className = "",
}: TransactionEcoImpactProps) {
  return (
    <EcoImpactDisplay
      contributionAmount={contributionAmount}
      variant={compact ? "compact" : "transaction"}
      clickable={clickable}
      className={className}
    />
  );
}
