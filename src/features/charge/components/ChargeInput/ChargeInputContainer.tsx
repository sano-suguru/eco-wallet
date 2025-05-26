"use client";

import { useState, useMemo } from "react";
import {
  validateAmountResult,
  validateEmailResult,
} from "@/lib/utils/validation";
import { validateChargeAmount } from "@/lib/business/balance";
import { chargeBalance, ChargeRequest } from "@/services/api/balance";
import { getErrorMessage } from "@/lib/utils/error-utils";
import { ChargeInputForm } from "./ChargeInputForm";

/**
 * チャージ入力コンテナのプロパティ
 */
export interface ChargeInputContainerProps {
  /** 確認ステップに進む際のコールバック */
  onProceedToConfirm?: (amount: number) => void;
}

/**
 * チャージ入力の状態管理とロジックを担当するコンテナコンポーネント
 *
 * @param onProceedToConfirm 確認ステップに進む際のコールバック
 */
export function ChargeInputContainer({
  onProceedToConfirm,
}: ChargeInputContainerProps) {
  // フォーム状態
  const [amount, setAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "bank">(
    "credit-card",
  );
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transferCode, setTransferCode] = useState<string>("");
  const [processingVerification, setProcessingVerification] =
    useState<boolean>(false);

  // バリデーション（Result型対応）
  const amountValidationResult = useMemo(
    () => validateAmountResult(amount, 1, 1000000),
    [amount],
  );
  const emailValidationResult = useMemo(
    () => validateEmailResult(email),
    [email],
  );

  const isValidAmount = amountValidationResult.isOk();
  const validEmail = emailValidationResult.isOk();

  // 金額クイック選択ハンドラー
  const handleSelectAmount = (value: string) => {
    setAmount(value);
    setError(null);
  };

  // フォーム送信ハンドラー（Result型対応）
  const handleProceedToConfirm = () => {
    console.log("handleProceedToConfirm called with amount:", amount);

    // Result型バリデーション
    if (amountValidationResult.isErr()) {
      const validationError = amountValidationResult.error;
      setError(getErrorMessage(validationError));
      console.log("Amount validation failed:", validationError);
      return;
    }

    const validatedAmount = amountValidationResult.value;

    // ビジネスロジック層でのバリデーション
    const chargeValidationResult = validateChargeAmount(validatedAmount);
    if (chargeValidationResult.isErr()) {
      const businessError = chargeValidationResult.error;
      setError(getErrorMessage(businessError));
      console.log("Charge validation failed:", businessError);
      return;
    }

    // 入力が有効であれば次のステップに進む
    if (onProceedToConfirm) {
      console.log(
        "Calling onProceedToConfirm with validatedAmount:",
        validatedAmount,
      );
      onProceedToConfirm(validatedAmount);
    } else {
      console.log("onProceedToConfirm is not defined");
    }
  };

  // 銀行振込メール送信処理（Result型対応）
  const handleSendBankTransferEmail = async () => {
    // メールアドレスのバリデーション
    if (emailValidationResult.isErr()) {
      const validationError = emailValidationResult.error;
      setError(getErrorMessage(validationError));
      return;
    }

    // 金額のバリデーション
    if (amountValidationResult.isErr()) {
      const validationError = amountValidationResult.error;
      setError(getErrorMessage(validationError));
      return;
    }

    const validatedEmail = emailValidationResult.value;
    const validatedAmount = amountValidationResult.value;

    // ビジネスロジック層でのチャージバリデーション
    const chargeValidationResult = validateChargeAmount(validatedAmount);
    if (chargeValidationResult.isErr()) {
      const businessError = chargeValidationResult.error;
      setError(getErrorMessage(businessError));
      return;
    }

    setIsLoading(true);
    setError(null);

    // API呼び出し（Result型対応）
    const chargeRequest: ChargeRequest = {
      amount: validatedAmount,
      paymentMethod: "bank_transfer",
      paymentDetails: {
        email: validatedEmail,
        requestType: "bank_transfer_instructions",
      },
    };

    const result = await chargeBalance(chargeRequest);

    result.match(
      (response) => {
        // 成功時の処理
        setTransferCode(response.transactionId);
        setEmailSent(true);
        console.log("Bank transfer request successful:", response);
      },
      (apiError) => {
        // エラー時の処理
        setError(getErrorMessage(apiError));
        console.error("Bank transfer request failed:", apiError);
      },
    );

    setIsLoading(false);
  };

  // 銀行振込通知処理（Result型対応）
  const handleNotifyBankTransfer = async () => {
    if (!transferCode) {
      setError("振込コードが見つかりません。再度メール送信を行ってください。");
      return;
    }

    setProcessingVerification(true);
    setError(null);

    // チャージステータス確認API呼び出し（Result型対応）
    const result = await chargeBalance({
      amount: amountValidationResult.isOk() ? amountValidationResult.value : 0,
      paymentMethod: "bank_transfer",
      paymentDetails: {
        transactionId: transferCode,
        requestType: "verification_request",
      },
    });

    result.match(
      (response) => {
        // 成功時の処理
        if (response.status === "completed") {
          setError("振込が確認されました。チャージが完了しました。");
        } else if (response.status === "pending") {
          setError(
            "振込確認リクエストを受け付けました。通常1営業日以内に確認します。",
          );
        } else {
          setError("振込の確認ができませんでした。もう一度お試しください。");
        }
        console.log("Bank transfer verification response:", response);
      },
      (apiError) => {
        // エラー時の処理
        setError(getErrorMessage(apiError));
        console.error("Bank transfer verification failed:", apiError);
      },
    );

    setProcessingVerification(false);
  };

  return (
    <ChargeInputForm
      amount={amount}
      setAmount={setAmount}
      email={email}
      setEmail={setEmail}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      emailSent={emailSent}
      error={error}
      handleSelectAmount={handleSelectAmount}
      handleProceedToConfirm={handleProceedToConfirm}
      handleSendBankTransferEmail={handleSendBankTransferEmail}
      transferCode={transferCode}
      setTransferCode={setTransferCode}
      processingVerification={processingVerification}
      handleNotifyBankTransfer={handleNotifyBankTransfer}
      isValidAmount={isValidAmount}
      isEmailValid={validEmail}
      isLoading={isLoading}
    />
  );
}
