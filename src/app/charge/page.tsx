"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { ChargeStepInput } from "@/components/charge/ChargeStepInput";
import { ChargeStepConfirm } from "@/components/charge/ChargeStepConfirm";
import { ChargeStepComplete } from "@/components/charge/ChargeStepComplete";

type ChargeStep = "input" | "confirm" | "complete";

export default function ChargePage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  // 基本状態
  const [currentStep, setCurrentStep] = useState<ChargeStep>("input");
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "bank">(
    "credit-card",
  );
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");

  // 銀行振込関連の状態
  const [email, setEmail] = useState<string>("");
  const [transferCode, setTransferCode] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [processingVerification, setProcessingVerification] =
    useState<boolean>(false);

  // 金額選択ハンドラー
  const handleSelectAmount = (value: string) => {
    setAmount(value);
  };

  // 確認ステップへの移行
  const handleProceedToConfirm = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("有効な金額を入力してください");
      return;
    }
    setError(null);
    setCurrentStep("confirm");
  };

  // 入力ステップに戻る
  const handleBackToInput = () => {
    setCurrentStep("input");
  };

  // クレジットカードチャージ処理
  const handleConfirmCharge = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // モック処理として遅延を入れる
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // モックのトランザクションID生成
      const mockTransactionId = `TXN${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTransactionId);

      // セッションの残高を更新 (モック)
      if (session?.user) {
        const newBalance = (session.user.balance || 0) + Number(amount);
        // 本来はバックエンドからのレスポンスに基づいて更新する
        await update({ balance: newBalance });
      }

      setCurrentStep("complete");
    } catch {
      setError(
        "チャージ処理中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 振込情報取得処理
  const handleSendBankTransferEmail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // メール形式の簡易バリデーション
      if (!email || !email.includes("@")) {
        setError("有効なメールアドレスを入力してください");
        setIsLoading(false);
        return;
      }

      // 金額のバリデーション
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError("有効な金額を入力してください");
        setIsLoading(false);
        return;
      }

      // 振込コードの生成（実際はバックエンドで生成してDBに保存）
      const generatedCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setTransferCode(generatedCode);

      // メール送信をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 送信完了状態に更新
      setEmailSent(true);
    } catch {
      setError(
        "メール送信中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 振込完了通知処理
  const handleNotifyBankTransfer = async () => {
    setProcessingVerification(true);
    setError(null);

    try {
      // 振込確認をシミュレート（実際はバックエンドで照合）
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // モックのトランザクションID生成
      const mockTransactionId = `BNK${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTransactionId);

      // セッションの残高を更新（モック）
      if (session?.user) {
        const newBalance = (session.user.balance || 0) + Number(amount);
        await update({ balance: newBalance });
      }

      // 完了ステップに進む
      setCurrentStep("complete");
    } catch {
      setError(
        "振込確認中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setProcessingVerification(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <svg viewBox="0 0 100 40" className="h-12 w-auto fill-teal-700">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Eco Wallet
          </h1>
          <p className="text-sm text-stone-600">
            シンプルで環境に優しい決済サービス
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white">
          {currentStep === "input" && (
            <ChargeStepInput
              amount={amount}
              setAmount={setAmount}
              email={email}
              setEmail={setEmail}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              emailSent={emailSent}
              setEmailSent={setEmailSent}
              isLoading={isLoading}
              error={error}
              handleSelectAmount={handleSelectAmount}
              handleProceedToConfirm={handleProceedToConfirm}
              handleSendBankTransferEmail={handleSendBankTransferEmail}
              transferCode={transferCode}
              setTransferCode={setTransferCode}
              processingVerification={processingVerification}
              handleNotifyBankTransfer={handleNotifyBankTransfer}
            />
          )}

          {currentStep === "confirm" && (
            <ChargeStepConfirm
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
            <ChargeStepComplete
              amount={amount}
              paymentMethod={paymentMethod}
              session={session}
              transactionId={transactionId}
              transferCode={transferCode}
              router={router}
            />
          )}
        </Card>

        <p className="text-xs text-center text-stone-500">
          このサービスは環境に配慮した素材で作られたサーバーで運用されています
        </p>
      </div>
    </div>
  );
}
