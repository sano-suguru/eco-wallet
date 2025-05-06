"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // キャンセルボタンのクリックハンドラー
  const handleCancel = () => {
    if (!isProcessing) {
      router.back();
    }
  };

  // 決済確定ボタンのクリックハンドラー
  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      // 決済処理のモック - 実際のAPIコールの代わりにタイマーを使用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 決済成功状態を設定
      setIsSuccess(true);

      // 成功表示を少し見せた後に遷移
      setTimeout(() => {
        // 決済の詳細を取引履歴に記録したと仮定して、取引詳細ページへ
        // トランザクションIDはモックとして生成
        const mockTransactionId = `txn_${Date.now().toString(36)}`;
        router.push(`/history/${mockTransactionId}`);
      }, 1000);
    } catch (error) {
      // エラー処理（実際のアプリではエラー状態を管理）
      console.error("決済処理中にエラーが発生しました", error);
      setIsProcessing(false);
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
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-teal-800">決済確認</CardTitle>
            <CardDescription>購入内容の確認と決済を行います</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 成功メッセージ */}
            {isSuccess && (
              <div className="bg-teal-50 p-4 rounded-md border border-teal-100 flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-teal-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-teal-800">
                    決済完了
                  </h3>
                  <p className="text-xs text-teal-700">
                    決済が正常に完了しました。取引ページに移動します...
                  </p>
                </div>
              </div>
            )}

            {!isSuccess && (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-stone-700">
                    商品情報
                  </h3>
                  <div className="bg-stone-50 rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-stone-200 rounded flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 text-stone-500"
                          >
                            <path
                              fill="currentColor"
                              d="M21,9H3V3H21V9M13,11H3V21H13V11M21,11H15V15H21V11M21,17H15V21H21V17Z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-stone-800">
                            エコ製品定期プラン
                          </h4>
                          <p className="text-xs text-stone-600">
                            リサイクル素材100%
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-stone-800">
                        ¥3,800
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">小計</span>
                      <span className="text-stone-800">¥3,800</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        環境保全負担金（寄付）
                      </span>
                      <span className="text-stone-800">¥200</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-800">合計</span>
                      <span className="text-teal-800">¥4,000</span>
                    </div>
                  </div>
                </div>

                <Alert className="bg-teal-50 border-teal-200">
                  <AlertDescription className="text-xs text-teal-800">
                    この商品はリサイクル素材を使用し、製造過程でのCO2排出量を80%削減しています
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-stone-700">
                    支払い方法
                  </h3>
                  <RadioGroup defaultValue="wallet" className="space-y-2">
                    <div className="flex items-center space-x-2 rounded-md border border-stone-200 p-3">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex-1 text-sm">
                        <div className="flex justify-between">
                          <span>Eco Wallet残高</span>
                          <span className="font-medium">¥12,500</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border border-stone-200 p-3 bg-stone-50 text-stone-400">
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label htmlFor="card" className="flex-1 text-sm">
                        登録済みカード
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="donate" defaultChecked />
                    <div className="grid gap-1">
                      <Label
                        htmlFor="donate"
                        className="text-sm font-medium text-stone-800"
                      >
                        環境保全活動に200円を寄付する
                      </Label>
                      <p className="text-xs text-stone-600">
                        寄付金は山岳地域の清掃活動に使用されます
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="receipt" />
                    <div className="grid gap-1">
                      <Label
                        htmlFor="receipt"
                        className="text-sm font-medium text-stone-800"
                      >
                        紙のレシートを発行しない
                      </Label>
                      <p className="text-xs text-stone-600">
                        電子レシートをメールでお送りします
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
              onClick={handleConfirmPayment}
              disabled={isProcessing || isSuccess}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" light className="mr-2" />
                  決済処理中...
                </>
              ) : (
                "決済を確定する"
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-stone-600 hover:text-stone-800 hover:bg-stone-100"
              onClick={handleCancel}
              disabled={isProcessing || isSuccess}
            >
              キャンセル
            </Button>
          </CardFooter>
        </Card>

        <p className="text-xs text-center text-stone-500">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
