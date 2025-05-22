"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmountInput } from "./AmountInput";
import { BankTransferInput } from "./BankTransferInput";

/**
 * チャージ入力フォームのプロパティ
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
  /** エラーメッセージ */
  error: string | null;
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
      <>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-teal-800">チャージ</CardTitle>
          <CardDescription>あなたのアカウントにチャージします</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert className="bg-teal-50 border-teal-200">
            <AlertDescription className="text-xs text-teal-800">
              ペーパーレス決済で、取引ごとに環境保護団体への寄付が行われます
            </AlertDescription>
          </Alert>

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
            <TabsList className="grid w-full grid-cols-2 bg-stone-100">
              <TabsTrigger
                value="credit-card"
                className="text-sm"
                disabled={emailSent}
              >
                クレジットカード
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="text-sm"
                disabled={emailSent}
              >
                銀行振込
              </TabsTrigger>
            </TabsList>

            {/* クレジットカード入力タブ */}
            <TabsContent value="credit-card" className="space-y-4 pt-4">
              <AmountInput
                amount={amount}
                setAmount={setAmount}
                handleSelectAmount={handleSelectAmount}
                error={error}
              />
            </TabsContent>

            {/* 銀行振込タブ */}
            <TabsContent value="bank" className="space-y-4 pt-4">
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
        </CardContent>

        {/* クレジットカード決済時のみフッターボタンを表示 */}
        <CardFooter>
          {paymentMethod === "credit-card" && (
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
              onClick={handleProceedToConfirm}
              disabled={!isValidAmount || !amount}
            >
              次へ進む
            </Button>
          )}
        </CardFooter>
      </>
    );
  },
);

ChargeInputForm.displayName = "ChargeInputForm";
