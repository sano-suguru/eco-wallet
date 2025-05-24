"use client";

import { useState } from "react";
import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { DonationProject } from "../../types/donation";
import { DonateInputForm } from "./DonateInputForm";

interface DonateInputContainerProps {
  project: DonationProject;
  onProceed: (amount: number) => void;
}

// コンテナコンポーネント: 状態管理とロジック処理を担当
export function DonateInputContainer({
  project,
  onProceed,
}: DonateInputContainerProps) {
  // フォーム状態
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // 残高データの取得
  const balance = useBalanceStore((state) => state.getTotalBalance());

  // 金額クイック選択ハンドラー
  const handleSelectAmount = (value: string) => {
    setAmount(value);
    setError(null); // エラーをクリア
  };

  // フォーム送信ハンドラー
  const handleProceedToConfirm = () => {
    // バリデーション
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      setError("金額を入力してください");
      return;
    }

    if (numAmount <= 0) {
      setError("0より大きい金額を入力してください");
      return;
    }

    if (numAmount > balance) {
      setError("残高が足りません");
      return;
    }

    // 入力が有効であれば次のステップに進む
    onProceed(numAmount);
  };

  return (
    <DonateInputForm
      project={project}
      amount={amount}
      setAmount={setAmount}
      error={error}
      handleSelectAmount={handleSelectAmount}
      handleProceedToConfirm={handleProceedToConfirm}
      balance={balance}
    />
  );
}
