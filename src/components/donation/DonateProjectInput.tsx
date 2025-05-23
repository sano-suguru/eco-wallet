// このファイルは下位互換性のために維持されています
import { DonateInputContainer, DonationProject } from "@/features/donation";

interface DonateProjectInputProps {
  project: DonationProject;
  amount: string;
  setAmount: (value: string) => void;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: () => void;
  balance: number;
}

// 下位互換性のための中継コンポーネント
export function DonateProjectInput({
  project,
  handleProceedToConfirm,
}: DonateProjectInputProps) {
  // 新しいコンポーネントに処理を委譲
  return (
    <DonateInputContainer
      project={project}
      onProceed={() => handleProceedToConfirm()}
    />
  );
}
