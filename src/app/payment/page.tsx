"use client";

import { useEffect } from "react";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle } from "lucide-react";
import {
  usePaymentStore,
  ProductInfo,
  PaymentSummary,
  PaymentMethodSelector,
  PaymentOptionsComponent,
  mockProducts,
  mockPaymentMethods,
  defaultPaymentOptions,
} from "@/features/payment";

export default function PaymentPage() {
  const router = useRouter();
  const {
    paymentInfo,
    paymentStatus,
    setPaymentInfo,
    setPaymentMethod,
    setPaymentOptions,
    processPayment,
    resetPayment,
  } = usePaymentStore();

  // 初期化
  useEffect(() => {
    // デモ用に最初の商品を使用
    const product = mockProducts[0];
    const donationAmount = defaultPaymentOptions.donationAmount;

    setPaymentInfo({
      product,
      subtotal: product.price,
      donationAmount,
      total: product.price + donationAmount,
      selectedPaymentMethod: "wallet",
      options: defaultPaymentOptions,
    });

    // クリーンアップ
    return () => {
      resetPayment();
    };
  }, [setPaymentInfo, resetPayment]);

  // キャンセルボタンのクリックハンドラー
  const handleCancel = () => {
    if (paymentStatus !== "processing") {
      router.back();
    }
  };

  // 決済確定ボタンのクリックハンドラー
  const handleConfirmPayment = async () => {
    const result = await processPayment();

    if (result.success && result.transactionId) {
      // 成功表示を少し見せた後に遷移
      setTimeout(() => {
        router.push(`/history/${result.transactionId}`);
      }, 1000);
    }
  };

  if (!paymentInfo) {
    return null; // 初期化中
  }

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
            {paymentStatus === "success" && (
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

            {paymentStatus !== "success" && (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-stone-700">
                    商品情報
                  </h3>
                  <ProductInfo product={paymentInfo.product} />
                  <PaymentSummary
                    subtotal={paymentInfo.subtotal}
                    donationAmount={paymentInfo.donationAmount}
                    total={paymentInfo.total}
                    showDonation={paymentInfo.options.includeDonation}
                  />
                </div>

                {paymentInfo.product.isEcoFriendly &&
                  paymentInfo.product.ecoDescription && (
                    <Alert className="bg-teal-50 border-teal-200">
                      <AlertDescription className="text-xs text-teal-800">
                        {paymentInfo.product.ecoDescription}
                      </AlertDescription>
                    </Alert>
                  )}

                <PaymentMethodSelector
                  methods={mockPaymentMethods}
                  selectedMethod={paymentInfo.selectedPaymentMethod}
                  onMethodChange={setPaymentMethod}
                />

                <PaymentOptionsComponent
                  options={paymentInfo.options}
                  onOptionsChange={setPaymentOptions}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
              onClick={handleConfirmPayment}
              disabled={
                paymentStatus === "processing" || paymentStatus === "success"
              }
            >
              {paymentStatus === "processing" ? (
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
              disabled={
                paymentStatus === "processing" || paymentStatus === "success"
              }
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
