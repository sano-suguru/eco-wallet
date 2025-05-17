"use client";

import { useState } from "react";
import { validateAmount, isValidEmail } from "@/lib/utils/validation";
import ChargeInputForm from "./ChargeInputForm";

interface ChargeInputContainerProps {
  onProceedToConfirm?: (amount: number) => void;
}

// コンテナコンポーネント: 状態管理とロジック処理を担当
export default function ChargeInputContainer({
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

  // バリデーション
  const amountValidation = validateAmount(amount);
  const isValidAmount = amountValidation.isValid;
  const validEmail = isValidEmail(email);

  // 金額クイック選択ハンドラー
  const handleSelectAmount = (value: string) => {
    setAmount(value);
    setError(null);
  };

  // フォーム送信ハンドラー
  const handleProceedToConfirm = () => {
    // バリデーション
    if (!isValidAmount) {
      setError(amountValidation.reason || "金額を正しく入力してください");
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      setError("0より大きい金額を入力してください");
      return;
    }

    // 入力が有効であれば次のステップに進む
    if (onProceedToConfirm) {
      onProceedToConfirm(numAmount);
    }
  };

  // 銀行振込メール送信処理
  const handleSendBankTransferEmail = async () => {
    if (!validEmail) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    if (!isValidAmount) {
      setError("金額を正しく入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 実際のAPIリクエストの代わりにモックの処理
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ランダムな振込コードを生成
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setTransferCode(code);
      setEmailSent(true);
    } catch {
      setError("メールの送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  // 銀行振込通知処理
  const handleNotifyBankTransfer = async () => {
    setProcessingVerification(true);
    setError(null);

    try {
      // 実際のAPIリクエストの代わりにモックの処理
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // モック：50%の確率で成功、50%の確率で失敗
      if (Math.random() > 0.5) {
        throw new Error("確認に失敗しました");
      }

      setError(
        "振込確認リクエストを受け付けました。通常1営業日以内に確認します。",
      );
    } catch {
      setError(
        "振込確認に失敗しました。カスタマーサポートにお問い合わせください。",
      );
    } finally {
      setProcessingVerification(false);
    }
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
