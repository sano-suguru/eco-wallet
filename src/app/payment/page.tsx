"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, Leaf, ArrowLeft } from "lucide-react";
import { ErrorDisplay } from "@/components/ui/error-display";
import {
  usePaymentStore,
  ProductInfo,
  PaymentSummary,
  PaymentMethodSelectorContainer,
  PaymentOptionsComponent,
  mockProducts,
  mockPaymentMethods,
  defaultPaymentOptions,
} from "@/features/payment";
import { processPayment } from "@/lib/business/payment";
import type { ProcessPaymentParams } from "@/lib/business/payment";
import type { AppError } from "@/shared/types/errors";
import { showAppErrorNotification } from "@/shared/stores/app.slice";

export default function PaymentPage() {
  const router = useRouter();
  const {
    paymentInfo,
    setPaymentInfo,
    setPaymentMethod,
    setPaymentOptions,
    resetPayment,
  } = usePaymentStore();

  // Result型対応のstate
  const [error, setError] = useState<AppError | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

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
      setError(null);
      setIsProcessing(false);
      setIsSuccess(false);
      setTransactionId(null);
    };
  }, [setPaymentInfo, resetPayment]);

  // キャンセルボタンのクリックハンドラー
  const handleCancel = () => {
    if (!isProcessing) {
      router.back();
    }
  };

  // 決済確定ボタンのクリックハンドラー（Result型対応版）
  const handleConfirmPayment = async () => {
    if (!paymentInfo) return;

    // エラーとフラグをリセット
    setError(null);
    setIsProcessing(true);

    try {
      // 決済方法をProcessPaymentParamsの形式にマッピング
      let paymentMethod: ProcessPaymentParams["paymentMethod"];
      switch (paymentInfo.selectedPaymentMethod) {
        case "card":
          paymentMethod = "credit_card";
          break;
        case "bank":
          paymentMethod = "bank_transfer";
          break;
        case "wallet":
          paymentMethod = "bank_transfer"; // walletはbank_transferとして処理
          break;
        default:
          paymentMethod = "credit_card"; // デフォルト
      }

      // 決済パラメータの作成
      const paymentParams: ProcessPaymentParams = {
        amount: paymentInfo.total,
        paymentMethod,
        description: `${paymentInfo.product.name}の購入`,
        metadata: {
          productId: paymentInfo.product.id,
          productName: paymentInfo.product.name,
          donationAmount: paymentInfo.donationAmount,
          includeDonation: paymentInfo.options.includeDonation,
        },
      };

      // ビジネスロジック層のprocessPayment関数を呼び出し
      const result = await processPayment(paymentParams);

      // .match()パターンで成功・失敗を明示的に処理
      result.match(
        (paymentState) => {
          // 成功時の処理
          setTransactionId(paymentState.transactionId);
          setIsSuccess(true);

          // 成功表示を少し見せた後に遷移
          setTimeout(() => {
            router.push(`/history/${paymentState.transactionId}`);
          }, 1000);
        },
        (paymentError) => {
          // 失敗時の処理
          setError(paymentError);
          showAppErrorNotification(paymentError, "決済エラー");
        },
      );
    } catch (unexpectedError) {
      // 予期しないエラーの処理
      const errorToSet: AppError = {
        type: "PAYMENT_FAILED",
        message: "決済処理中に予期しないエラーが発生しました",
        reason: String(unexpectedError),
        paymentId: undefined,
      };
      setError(errorToSet);
      showAppErrorNotification(errorToSet, "決済エラー");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentInfo) {
    return null; // 初期化中
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-8 px-4">
      {/* ヘッダー */}
      <div className="max-w-md mx-auto mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="mb-4 -ml-2 text-stone-600 hover:text-stone-800"
          disabled={isProcessing || isSuccess}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-stone-800 mb-2">決済確認</h1>
          <p className="text-sm text-stone-600">
            購入内容をご確認の上、決済を行ってください
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* エラー表示 */}
        {error && (
          <ErrorDisplay error={error} variant="inline" className="mb-4" />
        )}

        {/* 成功メッセージ */}
        {isSuccess && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-teal-50 to-green-50">
            <CardContent className="flex items-center p-6">
              <div className="bg-teal-100 rounded-full p-3 mr-4">
                <CheckCircle className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-800">
                  決済が完了しました
                </h3>
                <p className="text-sm text-teal-700 mt-1">
                  取引履歴に移動しています...
                </p>
                {transactionId && (
                  <p className="text-xs text-teal-600 mt-2">
                    取引ID: {transactionId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!isSuccess && (
          <>
            {/* 商品情報カード */}
            <Card className="border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-stone-800">
                  購入商品
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductInfo product={paymentInfo.product} />

                {paymentInfo.product.isEcoFriendly &&
                  paymentInfo.product.ecoDescription && (
                    <div className="mt-4 bg-teal-50 border border-teal-100 rounded-lg p-3">
                      <div className="flex items-start">
                        <Leaf className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-teal-700">
                          {paymentInfo.product.ecoDescription}
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* 支払い方法カード */}
            <Card className="border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-stone-800">
                  支払い方法
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelectorContainer
                  methods={mockPaymentMethods}
                  selectedMethod={paymentInfo.selectedPaymentMethod}
                  onMethodChange={setPaymentMethod}
                  paymentAmount={paymentInfo.total}
                />
              </CardContent>
            </Card>

            {/* 環境オプションカード */}
            <Card className="border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-stone-800 flex items-center">
                  <Leaf className="h-4 w-4 text-teal-600 mr-2" />
                  環境への貢献
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentOptionsComponent
                  options={paymentInfo.options}
                  onOptionsChange={setPaymentOptions}
                />
              </CardContent>
            </Card>

            {/* 決済サマリーカード */}
            <Card className="border border-stone-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-stone-800">
                  お支払い金額
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentSummary
                  subtotal={paymentInfo.subtotal}
                  donationAmount={paymentInfo.donationAmount}
                  total={paymentInfo.total}
                  showDonation={paymentInfo.options.includeDonation}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* 決済ボタン */}
        <div className="space-y-3 pt-2">
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-medium shadow-sm transition-all duration-200"
            onClick={handleConfirmPayment}
            disabled={isProcessing || isSuccess}
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" light className="mr-2" />
                決済処理中...
              </>
            ) : (
              <>
                決済を確定する
                <span className="ml-2 text-sm font-normal">
                  (¥{paymentInfo?.total.toLocaleString()})
                </span>
              </>
            )}
          </Button>

          {!isSuccess && (
            <p className="text-xs text-center text-stone-500">
              決済を確定すると、売上の1%が環境保護団体に寄付されます
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
