import EcoImpactContainer from "@/components/eco/EcoImpact";

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
    <EcoImpactContainer
      contributionAmount={contributionAmount}
      variant={compact ? "compact" : "transaction"}
      clickable={clickable}
      className={className}
    />
  );
}
