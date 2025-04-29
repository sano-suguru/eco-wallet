import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Leaf } from "lucide-react";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ChargeStepCompleteProps {
  amount: string;
  paymentMethod: "credit-card" | "bank";
  session: Session | null;
  transactionId: string;
  transferCode?: string;
  router: AppRouterInstance;
}

export function ChargeStepComplete({
  amount,
  paymentMethod,
  session,
  transactionId,
  transferCode,
  router,
}: ChargeStepCompleteProps) {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-teal-800">チャージ完了</CardTitle>
        <CardDescription>
          {paymentMethod === "credit-card"
            ? "チャージが正常に完了しました"
            : "振込確認が完了しました"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className="bg-teal-50 rounded-full p-4 w-20 h-20 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-teal-600" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-stone-800">
            ¥{Number(amount).toLocaleString()}が
            {paymentMethod === "credit-card" ? "チャージ" : "振込確認"}
            されました
          </h3>
          <p className="text-sm text-stone-600 mt-1">
            現在の残高: ¥{(session?.user?.balance || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-stone-50 p-3 rounded-md w-full">
          <div className="text-xs text-stone-600">取引ID: {transactionId}</div>
          <div className="text-xs text-stone-600">
            日時: {new Date().toLocaleString("ja-JP")}
          </div>
          {paymentMethod === "bank" && transferCode && (
            <div className="text-xs text-stone-600">
              振込コード: {transferCode}
            </div>
          )}
        </div>

        <div className="bg-teal-50 p-3 rounded-md border border-teal-100 w-full">
          <div className="flex items-start">
            <Leaf className="h-4 w-4 text-teal-600 mt-0.5 mr-2" />
            <div className="text-xs text-teal-700">
              この
              {paymentMethod === "credit-card" ? "チャージ" : "振込"}
              により、¥
              {Math.floor(Number(amount) * 0.005).toLocaleString()}が
              環境保全活動に寄付されました。ご協力ありがとうございます。
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          onClick={() => router.push("/")}
        >
          ホームに戻る
        </Button>
        <Button
          variant="outline"
          className="w-full text-stone-600"
          onClick={() => router.push("/history")}
        >
          取引履歴を確認
        </Button>
      </CardFooter>
    </>
  );
}
