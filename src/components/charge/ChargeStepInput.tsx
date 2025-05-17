import ChargeInputContainer from "./ChargeInput";

interface ChargeStepInputProps {
  amount: string;
  setAmount: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  paymentMethod: "credit-card" | "bank";
  setPaymentMethod: (value: "credit-card" | "bank") => void;
  emailSent: boolean;
  setEmailSent: (value: boolean) => void;
  isLoading: boolean;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: (amount?: number) => void;
  handleSendBankTransferEmail: () => void;
  transferCode: string;
  setTransferCode: (value: string) => void;
  processingVerification: boolean;
  handleNotifyBankTransfer: () => void;
}

// 下位互換性のためのレガシーコンポーネント
// 新しいリファクタリングされたコンポーネントにデリゲートする
export function ChargeStepInput({
  handleProceedToConfirm,
}: ChargeStepInputProps) {
  return (
    <ChargeInputContainer
      onProceedToConfirm={(amount) => handleProceedToConfirm(amount)}
    />
  );
}
