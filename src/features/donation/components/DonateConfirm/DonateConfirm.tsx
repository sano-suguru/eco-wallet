import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Leaf } from "lucide-react";
import { Session } from "next-auth";
import { formatCurrency } from "@/shared/utils/formats";
import { DonationProject } from "@/features/donation/types/donation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AppError } from "@/shared/types/errors";
import { ErrorDisplay } from "@/components/ui/error-display";

interface DonateConfirmProps {
  project: DonationProject;
  amount: string;
  session: Session | null;
  isLoading: boolean;
  error: AppError | null;
  handleConfirmDonation: () => Promise<void>;
  handleBackToInput: () => void;
}

export function DonateConfirm({
  project,
  amount,
  session,
  isLoading,
  error,
  handleConfirmDonation,
  handleBackToInput,
}: DonateConfirmProps) {
  const estimatedImpact = {
    forestArea:
      project.imageType === "mountain"
        ? Number(amount) * 0.0007
        : Number(amount) * 0.0003,
    waterSaved:
      project.imageType === "ocean"
        ? Number(amount) * 0.4
        : Number(amount) * 0.2,
    co2Reduction: Number(amount) * 0.015,
  };

  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 h-8 w-8 p-0"
            onClick={handleBackToInput}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl text-teal-800">寄付確認</CardTitle>
            <CardDescription>内容をご確認ください</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-stone-50 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-stone-600">寄付先:</span>
            <span className="text-sm font-medium text-stone-800">
              {project.title}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-stone-600">寄付金額:</span>
            <span className="text-lg font-bold text-teal-800">
              {formatCurrency(Number(amount))}
            </span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between">
            <span className="text-sm text-stone-600">寄付後残高:</span>
            <span className="text-sm font-medium text-stone-800">
              {formatCurrency((session?.user?.balance || 0) - Number(amount))}
            </span>
          </div>
        </div>

        <div className="bg-teal-50 p-3 rounded-md border border-teal-100">
          <h3 className="text-sm font-medium text-teal-800 mb-2 flex items-center">
            <Leaf className="h-4 w-4 mr-2 text-teal-600" />
            寄付による環境貢献効果の予測
          </h3>

          <div className="space-y-2 text-xs text-teal-700">
            <div className="flex justify-between">
              <span>森林保全面積:</span>
              <span className="font-medium">
                {estimatedImpact.forestArea.toFixed(2)} m²
              </span>
            </div>
            <div className="flex justify-between">
              <span>水資源保全:</span>
              <span className="font-medium">
                {Math.round(estimatedImpact.waterSaved)} L
              </span>
            </div>
            <div className="flex justify-between">
              <span>CO2削減量:</span>
              <span className="font-medium">
                {estimatedImpact.co2Reduction.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {error && (
          <ErrorDisplay error={error} variant="inline" className="mb-2" />
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          onClick={handleConfirmDonation}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" light className="mr-2" />
              処理中...
            </div>
          ) : (
            "寄付を確定する"
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full text-stone-600 hover:text-stone-800 hover:bg-stone-100"
          onClick={handleBackToInput}
          disabled={isLoading}
        >
          戻る
        </Button>
      </CardFooter>
    </>
  );
}
