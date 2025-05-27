import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Leaf } from "lucide-react";
import { Session } from "next-auth";
import { ErrorDisplay } from "@/components/ui/error-display";
import type { AppError } from "@/shared/types/errors";

interface ChargeConfirmProps {
  amount: string;
  paymentMethod: "credit-card" | "bank";
  session: Session | null;
  isLoading: boolean;
  error: AppError | null;
  handleConfirmCharge: () => Promise<void>;
  handleBackToInput: () => void;
}

export function ChargeConfirm({
  amount,
  paymentMethod,
  session,
  isLoading,
  error,
  handleConfirmCharge,
  handleBackToInput,
}: ChargeConfirmProps) {
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
            <CardTitle className="text-xl text-teal-800">
              チャージ確認
            </CardTitle>
            <CardDescription>内容をご確認ください</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-stone-50 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-stone-600">チャージ方法:</span>
            <span className="text-sm font-medium text-stone-800">
              {paymentMethod === "credit-card"
                ? "クレジットカード"
                : "銀行振込"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-stone-600">チャージ金額:</span>
            <span className="text-lg font-bold text-teal-800">
              ¥{Number(amount).toLocaleString()}
            </span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between">
            <span className="text-sm text-stone-600">チャージ後残高:</span>
            <span className="text-sm font-medium text-stone-800">
              ¥
              {(
                (session?.user?.balance || 0) + Number(amount)
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-teal-50 p-3 rounded-md border border-teal-100">
          <div className="flex items-start">
            <Leaf className="h-4 w-4 text-teal-600 mt-0.5 mr-2" />
            <div className="text-xs text-teal-700">
              Eco Walletでは、全ての取引で環境に配慮した電子決済を採用し、
              紙の使用を削減しています。また、チャージ金額の0.5%を自動的に環境保全団体へ寄付します。
            </div>
          </div>
        </div>

        {error && <ErrorDisplay error={error} variant="inline" />}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          onClick={handleConfirmCharge}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
              処理中...
            </>
          ) : (
            "チャージを確定する"
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
