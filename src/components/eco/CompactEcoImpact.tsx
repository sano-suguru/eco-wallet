import EcoImpactContainer from "@/components/eco/EcoImpact";

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
  // clickable プロパティが明示的に指定されていればそれを使用
  clickable,
}: CompactEcoImpactProps) {
  // clickable が明示的に指定されていればそれを使い、
  // そうでなければ disableLink の反対の値を使用
  const isClickable = clickable !== undefined ? clickable : !disableLink;

  return (
    <EcoImpactContainer
      contributionAmount={contributionAmount}
      variant="compact"
      // 新しいプロパティ
      clickable={isClickable}
      className={!showBorder ? "bg-transparent border-0" : ""}
    />
  );
}
