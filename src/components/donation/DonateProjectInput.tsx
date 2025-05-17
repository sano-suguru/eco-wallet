import { ProjectItem } from "@/lib/mock-data/news-projects";
import DonateInputContainer from "./DonateInput";

interface DonateProjectInputProps {
  project: ProjectItem;
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
