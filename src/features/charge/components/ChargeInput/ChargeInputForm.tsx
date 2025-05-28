"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, CreditCard, Building } from "lucide-react";
import { AppError } from "@/shared/types/errors";
import { AmountInput } from "./AmountInput";
import { BankTransferInput } from "./BankTransferInput";

/**
 * チャージ入力フォームのプロパティ（AppError型対応）
 */
export interface ChargeInputFormProps {
  /** チャージ金額 */
  amount: string;
  /** チャージ金額更新関数 */
  setAmount: (value: string) => void;
  /** メールアドレス */
  email: string;
  /** メールアドレス更新関数 */
  setEmail: (value: string) => void;
  /** 支払い方法 */
  paymentMethod: "credit-card" | "bank";
  /** 支払い方法更新関数 */
  setPaymentMethod: (value: "credit-card" | "bank") => void;
  /** メール送信済みフラグ */
  emailSent: boolean;
  /** エラー状態 */
  error: AppError | null;
  /** 金額選択ハンドラー */
  handleSelectAmount: (value: string) => void;
  /** 確認ステップ遷移ハンドラー */
  handleProceedToConfirm: () => void;
  /** 銀行振込メール送信ハンドラー */
  handleSendBankTransferEmail: () => void;
  /** 振込コード */
  transferCode: string;
  /** 振込コード更新関数 */
  setTransferCode: (value: string) => void;
  /** 振込確認処理中フラグ */
  processingVerification: boolean;
  /** 振込通知ハンドラー */
  handleNotifyBankTransfer: () => void;
  /** 金額の有効性 */
  isValidAmount: boolean;
  /** メールアドレスの有効性 */
  isEmailValid: boolean;
  /** ローディング状態 */
  isLoading: boolean;
}

/**
 * チャージ入力フォームのコンポーネント
 *
 * プレゼンテーションコンポーネントとして、フォームのUIを担当する。
 */
export const ChargeInputForm = React.memo(
  ({
    amount,
    setAmount,
    email,
    setEmail,
    paymentMethod,
    setPaymentMethod,
    emailSent,
    error,
    handleSelectAmount,
    handleProceedToConfirm,
    handleSendBankTransferEmail,
    transferCode,
    setTransferCode,
    processingVerification,
    handleNotifyBankTransfer,
    isValidAmount,
    isEmailValid,
    isLoading,
  }: ChargeInputFormProps) => {
    return (
      <div className="space-y-4">
        {/* 環境貢献メッセージ */}
        <Alert className="bg-teal-50 border-teal-100">
          <Leaf className="h-4 w-4 text-teal-600" />
          <AlertDescription className="text-sm text-teal-800 ml-2">
            ペーパーレス決済で、取引ごとに環境保護団体への寄付が行われます
          </AlertDescription>
        </Alert>

        {/* 支払い方法タブ */}
        <Card className="border border-stone-100 shadow-sm">
          <Tabs
            defaultValue={paymentMethod}
            className="w-full"
            onValueChange={(value) => {
              if (!emailSent) {
                if (value === "credit-card" || value === "bank") {
                  setPaymentMethod(value as "credit-card" | "bank");
                }
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2 bg-stone-50 p-1">
              <TabsTrigger
                value="credit-card"
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                disabled={emailSent}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                クレジットカード
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                disabled={emailSent}
              >
                <Building className="h-4 w-4 mr-2" />
                銀行振込
              </TabsTrigger>
            </TabsList>

            {/* クレジットカード入力タブ */}
            <TabsContent value="credit-card" className="px-6 py-4">
              <AmountInput
                amount={amount}
                setAmount={setAmount}
                handleSelectAmount={handleSelectAmount}
                error={error}
              />

              {/* 次へ進むボタン */}
              <Button
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-medium shadow-sm transition-all duration-200"
                onClick={handleProceedToConfirm}
                disabled={!isValidAmount || !amount}
              >
                確認画面へ進む
                {amount && (
                  <span className="ml-2 text-sm font-normal">
                    (¥{Number(amount).toLocaleString()})
                  </span>
                )}
              </Button>
            </TabsContent>

            {/* 銀行振込タブ */}
            <TabsContent value="bank" className="px-6 py-4">
              <BankTransferInput
                email={email}
                setEmail={setEmail}
                amount={amount}
                setAmount={setAmount}
                emailSent={emailSent}
                isLoading={isLoading}
                isValidEmail={isEmailValid}
                isValidAmount={isValidAmount}
                error={error}
                handleSelectAmount={handleSelectAmount}
                handleSendBankTransferEmail={handleSendBankTransferEmail}
                transferCode={transferCode}
                setTransferCode={setTransferCode}
                processingVerification={processingVerification}
                handleNotifyBankTransfer={handleNotifyBankTransfer}
              />
            </TabsContent>
          </Tabs>
        </Card>

        {/* 環境貢献額の自動計算表示 */}
        {amount && Number(amount) > 0 && (
          <Card className="border border-stone-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-teal-100 rounded-full p-2 mr-3">
                  <Leaf className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    環境保護団体への寄付額
                  </p>
                  <p className="text-xs text-stone-600">
                    チャージ額の1%が自動的に寄付されます
                  </p>
                </div>
              </div>
              <p className="text-lg font-semibold text-teal-700">
                ¥{Math.floor(Number(amount) * 0.01).toLocaleString()}
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  },
);

ChargeInputForm.displayName = "ChargeInputForm";
