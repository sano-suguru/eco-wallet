"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChargeInputContainer } from "@/features/charge/components/ChargeInput";
import { ChargeConfirm } from "@/features/charge/components/ChargeConfirm";
import { ChargeComplete } from "@/features/charge/components/ChargeComplete";
import { PageContainer } from "@/features/layout";
import { processCharge, type ChargeParams } from "@/lib/business/balance";
import { showAppErrorNotification } from "@/shared/stores/app.slice";
import type { AppError } from "@/shared/types/errors";

type ChargeStep = "input" | "confirm" | "complete";

export default function ChargePage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  // 基本状態
  const [currentStep, setCurrentStep] = useState<ChargeStep>("input");
  const [paymentMethod] = useState<"credit-card" | "bank">("credit-card");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");

  // 銀行振込関連の状態
  const [transferCode] = useState<string>("");

  // 確認ステップへの移行
  const handleProceedToConfirm = (receivedAmount?: number) => {
    // 受け取った金額がある場合は状態を更新
    if (receivedAmount) {
      setAmount(receivedAmount.toString());
    }

    const amountToCheck = receivedAmount ? receivedAmount.toString() : amount;
    if (
      !amountToCheck ||
      isNaN(Number(amountToCheck)) ||
      Number(amountToCheck) <= 0
    ) {
      const validationError: AppError = {
        type: "INVALID_AMOUNT",
        message: "有効な金額を入力してください",
        field: "amount",
      };
      setError(validationError);
      showAppErrorNotification(validationError);
      return;
    }
    setError(null);
    setCurrentStep("confirm");
  };

  // 入力ステップに戻る
  const handleBackToInput = () => {
    setCurrentStep("input");
  };

  // チャージ処理
  const handleConfirmCharge = async () => {
    setIsLoading(true);
    setError(null);

    const chargeParams: ChargeParams = {
      amount: Number(amount),
      paymentMethod:
        paymentMethod === "credit-card" ? "credit_card" : "bank_transfer",
      description: "Eco Walletチャージ",
    };

    const result = await processCharge(chargeParams);

    result.match(
      async (success) => {
        // チャージ成功
        setTransactionId(success.transactionId);

        // セッションの残高を更新
        if (session?.user) {
          const newBalance = (session.user.balance || 0) + success.amount;
          await update({ balance: newBalance });
        }

        setCurrentStep("complete");
      },
      (chargeError) => {
        // チャージ失敗
        setError(chargeError);
        showAppErrorNotification(chargeError, "チャージエラー");
      },
    );

    setIsLoading(false);
  };

  const handleBack = () => {
    if (currentStep === "input") {
      router.back();
    } else {
      handleBackToInput();
    }
  };

  return (
    <PageContainer showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-stone-50">
        {/* ヘッダー */}
        <div className="max-w-md mx-auto px-4 pt-6 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 -ml-2 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-stone-800 mb-2">
              {currentStep === "input" && "チャージ"}
              {currentStep === "confirm" && "チャージ確認"}
              {currentStep === "complete" && "チャージ完了"}
            </h1>
            <p className="text-sm text-stone-600">
              {currentStep === "input" &&
                "お支払い方法と金額を選択してください"}
              {currentStep === "confirm" && "チャージ内容をご確認ください"}
              {currentStep === "complete" && "チャージが完了しました"}
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pb-8">
          {currentStep === "input" && (
            <ChargeInputContainer
              onProceedToConfirm={(amount) => handleProceedToConfirm(amount)}
            />
          )}

          {currentStep === "confirm" && (
            <ChargeConfirm
              amount={amount}
              paymentMethod={paymentMethod}
              session={session}
              isLoading={isLoading}
              error={error}
              handleConfirmCharge={handleConfirmCharge}
              handleBackToInput={handleBackToInput}
            />
          )}

          {currentStep === "complete" && (
            <ChargeComplete
              amount={amount}
              paymentMethod={paymentMethod}
              session={session}
              transactionId={transactionId}
              transferCode={transferCode}
              router={router}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
