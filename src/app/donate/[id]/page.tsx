"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/features/layout";
import { DonateConfirm } from "@/features/donation/components/DonateConfirm";
import { DonateComplete } from "@/features/donation/components/DonateComplete";
import { DonateInputContainer } from "@/features/donation/components/DonateInput";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";
import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { useEcoImpactStore } from "@/features/eco-impact/store/eco-impact.slice";
import { useSession } from "next-auth/react";
import { newsAndProjects, ProjectItem } from "@/features/eco-news";
import { convertProjectItemToDonationProject } from "@/features/donation/utils/project-converter";
import { DonationProject } from "@/features/donation/types/donation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AppError } from "@/shared/types/errors";
import { showAppErrorNotification } from "@/shared/stores/app.slice";

type DonateStep = "input" | "confirm" | "complete";

export default function DonateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { data: session, update } = useSession();

  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const subtractFromRegularBalance = useBalanceStore(
    (state) => state.subtractFromRegularBalance,
  );
  const addContribution = useEcoImpactStore((state) => state.addContribution);

  // 基本状態
  const [currentStep, setCurrentStep] = useState<DonateStep>("input");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");
  const [project, setProject] = useState<DonationProject | null>(null);

  // プロジェクト情報を取得
  useEffect(() => {
    const projectData = newsAndProjects.find(
      (item) => item.id === projectId && item.type === "project",
    ) as ProjectItem | undefined;

    if (projectData) {
      const donationProject = convertProjectItemToDonationProject(projectData);
      setProject(donationProject);
    } else {
      setProject(null);
    }
  }, [projectId]);

  // 入力ステップに戻る
  const handleBackToInput = () => {
    setCurrentStep("input");
  };

  // 寄付処理
  const handleConfirmDonation = async () => {
    if (!project) return;

    setIsLoading(true);
    setError(null);

    try {
      // モック処理として遅延を入れる
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const donationAmount = Number(amount);

      // 1. 新しいトランザクションを作成（donation タイプ）
      const transactionResult = addTransaction({
        type: "donation",
        description: project.title,
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

      if (transactionResult.isErr()) {
        throw new Error(transactionResult.error.message);
      }

      setTransactionId(transactionResult.value);

      // 2. ユーザーの残高を更新
      subtractFromRegularBalance(donationAmount);

      // 3. 環境貢献情報を更新
      addContribution({
        amount: donationAmount,
        // プロジェクトタイプに応じた環境貢献データ
        forestArea:
          project.imageType === "mountain"
            ? donationAmount * 0.0007
            : project.imageType === "ocean"
              ? donationAmount * 0.0003
              : donationAmount * 0.0005,
        waterSaved:
          project.imageType === "ocean"
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
      const donationError: AppError = {
        type: "NETWORK_ERROR",
        message:
          "処理中にエラーが発生しました。時間をおいて再度お試しください。",
      };
      setError(donationError);
      showAppErrorNotification(donationError, "寄付エラー");
    } finally {
      setIsLoading(false);
    }
  };

  // プロジェクトが見つからない場合のエラー表示
  if (!project) {
    return (
      <PageContainer title="プロジェクト寄付" activeTab="eco">
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              指定されたプロジェクトが見つかりませんでした。
            </AlertDescription>
          </Alert>
          <Card className="border-0 shadow-md bg-white p-6 text-center">
            <p className="text-sm text-stone-700 mb-4">
              お探しのプロジェクトは存在しないか、削除された可能性があります。
            </p>
            <button
              className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md text-sm"
              onClick={() => router.push("/eco-news")}
            >
              プロジェクト一覧に戻る
            </button>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`${project.title}への寄付`} activeTab="eco">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-stone-800">
          {project.title}への寄付
        </h2>
        <Card className="border-0 shadow-md bg-white">
          {currentStep === "input" && (
            <DonateInputContainer
              project={project}
              onProceed={(donationAmount: number) => {
                setAmount(donationAmount.toString());
                setError(null);
                setCurrentStep("confirm");
              }}
            />
          )}

          {currentStep === "confirm" && (
            <DonateConfirm
              project={project}
              amount={amount}
              session={session}
              isLoading={isLoading}
              error={error}
              handleConfirmDonation={handleConfirmDonation}
              handleBackToInput={handleBackToInput}
            />
          )}

          {currentStep === "complete" && (
            <DonateComplete
              project={project}
              amount={amount}
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
