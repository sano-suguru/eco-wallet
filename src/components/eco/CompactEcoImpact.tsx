// src/components/eco/CompactEcoImpact.tsx
import { EcoImpactDisplay } from "@/components/eco/EcoImpactDisplay";

interface CompactEcoImpactProps {
  contributionAmount: number;
  showBorder?: boolean;
  // 互換性のために残しておくが、内部では clickable に変換
  disableLink?: boolean;
  // 新しいプロパティも追加（オプション）
  clickable?: boolean;
}

export function CompactEcoImpact({
  contributionAmount,
  showBorder = true,
  disableLink = false,
  // clickable プロパティが明示的に指定されていれば優先、そうでなければ disableLink の反対を使用
  clickable,
}: CompactEcoImpactProps) {
  // clickable が明示的に指定されていればそれを使い、
  // そうでなければ disableLink の反対の値を使用
  const isClickable = clickable !== undefined ? clickable : !disableLink;

  return (
    <EcoImpactDisplay
      contributionAmount={contributionAmount}
      variant="compact"
      // 新しいプロパティ
      clickable={isClickable}
      className={!showBorder ? "bg-transparent border-0" : ""}
    />
  );
}
