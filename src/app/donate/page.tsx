"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { DonateStepInput } from "@/components/donation/DonateStepInput";
import { DonateStepConfirm } from "@/components/donation/DonateStepConfirm";
import { DonateStepComplete } from "@/components/donation/DonateStepComplete";
import { useTransactionStore } from "@/stores/transactionStore";
import { useBalanceStore } from "@/stores/balanceStore";
import { useEcoImpactStore } from "@/stores/ecoImpactStore";
import { useSession } from "next-auth/react";

type DonateStep = "input" | "confirm" | "complete";

export default function DonatePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const subtractBalance = useBalanceStore((state) => state.subtractBalance);
  const addContribution = useEcoImpactStore((state) => state.addContribution);

  // 基本状態
  const [currentStep, setCurrentStep] = useState<DonateStep>("input");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("mountain");

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

    if (Number(amount) > (session?.user?.balance || 0)) {
      setError("残高が不足しています");
      return;
    }

    setError(null);
    setCurrentStep("confirm");
  };

  // 入力ステップに戻る
  const handleBackToInput = () => {
    setCurrentStep("input");
  };

  // 寄付処理
  const handleConfirmDonation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // モック処理として遅延を入れる
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const donationAmount = Number(amount);

      // 1. 新しいトランザクションを作成（donation タイプ）
      const newTransactionId = addTransaction({
        type: "donation",
        description:
          selectedProject === "mountain"
            ? "山岳環境保全プロジェクト"
            : selectedProject === "ocean"
              ? "海洋プラスチック削減イニシアチブ"
              : "環境保全プロジェクト",
        date: new Date()
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "/"),
        amount: -donationAmount,
        ecoContribution: {
          enabled: true,
          amount: donationAmount,
        },
      });

      setTransactionId(newTransactionId);

      // 2. ユーザーの残高を更新
      subtractBalance(donationAmount);

      // 3. 環境貢献情報を更新
      addContribution({
        amount: donationAmount,
        // オプションで詳細な環境貢献データを設定可能
        forestArea:
          selectedProject === "mountain"
            ? donationAmount * 0.0007
            : donationAmount * 0.0003,
        waterSaved:
          selectedProject === "ocean"
            ? donationAmount * 0.4
            : donationAmount * 0.2,
        co2Reduction: donationAmount * 0.015,
      });

      // 4. セッションの残高を更新 (モック)
      if (session?.user) {
        const newBalance = (session.user.balance || 0) - donationAmount;
        await update({ balance: newBalance });
      }

      setCurrentStep("complete");
    } catch (error) {
      console.error("寄付処理中にエラーが発生しました", error);
      setError(
        "処理中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="寄付" activeTab="eco">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-stone-800">
          環境保全プロジェクトへの寄付
        </h2>
        <Card className="border-0 shadow-md bg-white">
          {currentStep === "input" && (
            <DonateStepInput
              amount={amount}
              setAmount={setAmount}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              error={error}
              handleSelectAmount={handleSelectAmount}
              handleProceedToConfirm={handleProceedToConfirm}
              balance={session?.user?.balance || 0}
            />
          )}

          {currentStep === "confirm" && (
            <DonateStepConfirm
              amount={amount}
              selectedProject={selectedProject}
              session={session}
              isLoading={isLoading}
              error={error}
              handleConfirmDonation={handleConfirmDonation}
              handleBackToInput={handleBackToInput}
            />
          )}

          {currentStep === "complete" && (
            <DonateStepComplete
              amount={amount}
              selectedProject={selectedProject}
              session={session}
              transactionId={transactionId}
              router={router}
            />
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
