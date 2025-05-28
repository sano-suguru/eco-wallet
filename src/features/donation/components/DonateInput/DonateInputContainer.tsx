"use client";

import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { DonationProject } from "../../types/donation";
import { DonateInputForm } from "./DonateInputForm";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { validateDonationForm } from "@/features/auth/utils/validation";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ok, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";

interface DonateInputContainerProps {
  project: DonationProject;
  onProceed: (amount: number) => void;
}

// コンテナコンポーネント: 状態管理とロジック処理を担当
export function DonateInputContainer({
  project,
  onProceed,
}: DonateInputContainerProps) {
  // 残高データの取得
  const balanceResult = useBalanceStore((state) => state.getTotalBalance());
  const balance = balanceResult.isOk() ? balanceResult.value : 0;

  // useAuthFormフックを使用して寄付フォームを管理
  const donationForm = useAuthForm({
    initialValues: {
      amount: "",
    },
    validateForm: validateDonationForm,
    onSubmit: async (values) => {
      try {
        const numAmount = parseFloat(values.amount);

        // 残高不足チェック
        if (numAmount > balance) {
          const insufficientBalanceError: AppError = {
            type: "INSUFFICIENT_BALANCE",
            message: "残高が足りません",
            required: numAmount,
            available: balance,
          };
          return err(insufficientBalanceError);
        }

        // 寄付処理を実行（次のステップに進む）
        onProceed(numAmount);

        return ok(undefined);
      } catch {
        const appError: AppError = {
          type: "NETWORK_ERROR",
          message: "寄付処理中にエラーが発生しました",
        };
        return err(appError);
      }
    },
  });

  // エラー再試行ハンドラ
  const handleRetry = () => {
    donationForm.clearError();
  };

  // 金額クイック選択ハンドラー
  const handleSelectAmount = (value: string) => {
    donationForm.setValues({ amount: value });

    // フィールドエラーをクリア
    if (donationForm.fieldErrors.amount) {
      donationForm.clearFieldError("amount");
    }
  };

  // フォーム送信ハンドラー（DonateInputFormの型に合わせる）
  const handleProceedToConfirm = () => {
    // FormEventを作成してhandleSubmitを呼び出す
    const event = {
      preventDefault: () => {},
    } as React.FormEvent;

    donationForm.handleSubmit(event);
  };

  return (
    <div className="space-y-4">
      {/* エラー表示（Result型対応） */}
      {donationForm.error && (
        <ErrorDisplay
          error={donationForm.error}
          onRetry={handleRetry}
          className="mb-4"
        />
      )}

      <DonateInputForm
        project={project}
        amount={donationForm.values.amount}
        setAmount={(value: string) => donationForm.setValues({ amount: value })}
        error={donationForm.fieldErrors.amount?.message || null}
        handleSelectAmount={handleSelectAmount}
        handleProceedToConfirm={handleProceedToConfirm}
        balance={balance}
        isLoading={donationForm.isLoading}
      />
    </div>
  );
}
