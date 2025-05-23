import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Leaf, Trophy } from "lucide-react";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatCurrency } from "@/shared/utils/formats";
import { DonationProject } from "@/features/donation/types/donation";

interface DonateProjectCompleteProps {
  project: DonationProject;
  amount: string;
  session: Session | null;
  transactionId: string;
  router: AppRouterInstance;
}

export function DonateProjectComplete({
  project,
  amount,
  session,
  transactionId,
  router,
}: DonateProjectCompleteProps) {
  const donationAmount = Number(amount);

  const estimatedImpact = {
    forestArea:
      project.imageType === "mountain"
        ? donationAmount * 0.0007
        : donationAmount * 0.0003,
    waterSaved:
      project.imageType === "ocean"
        ? donationAmount * 0.4
        : donationAmount * 0.2,
    co2Reduction: donationAmount * 0.015,
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-teal-800">寄付完了</CardTitle>
        <CardDescription>ご寄付いただきありがとうございます</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col items-center">
        <div className="bg-teal-50 rounded-full p-4 w-20 h-20 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-teal-600" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-stone-800">
            {formatCurrency(donationAmount)}を寄付しました
          </h3>
          <p className="text-sm text-stone-600 mt-1">寄付先: {project.title}</p>
          <p className="text-sm text-stone-600">
            現在の残高: {formatCurrency(session?.user?.balance || 0)}
          </p>
        </div>

        <div className="bg-stone-50 p-3 rounded-md w-full">
          <div className="text-xs text-stone-600">取引ID: {transactionId}</div>
          <div className="text-xs text-stone-600">
            日時: {new Date().toLocaleString("ja-JP")}
          </div>
        </div>

        <div className="w-full bg-teal-50 p-4 rounded-md border border-teal-100">
          <div className="flex items-start space-x-3">
            <Trophy className="h-5 w-5 text-teal-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-teal-800">
                環境貢献効果
              </h3>
              <p className="text-xs text-teal-700 mt-1">
                あなたの寄付により、以下の環境保全効果が生まれました:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-teal-700">
                <li>
                  森林保全面積: {estimatedImpact.forestArea.toFixed(2)} m²
                </li>
                <li>水資源保全: {Math.round(estimatedImpact.waterSaved)} L</li>
                <li>CO2削減量: {estimatedImpact.co2Reduction.toFixed(1)} kg</li>
              </ul>
              <p className="text-xs text-teal-700 mt-2">
                これまでの累計寄付額: {formatCurrency(donationAmount)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          onClick={() => router.push("/impact")}
        >
          <Leaf className="h-4 w-4 mr-2" />
          環境インパクト詳細を見る
        </Button>
        <Button
          variant="outline"
          className="w-full text-stone-600"
          onClick={() => router.push("/")}
        >
          ホームに戻る
        </Button>
      </CardFooter>
    </>
  );
}
