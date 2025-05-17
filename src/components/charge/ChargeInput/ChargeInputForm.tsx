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
import AmountInput from "./AmountInput";
import BankTransferInput from "./BankTransferInput";

interface ChargeInputFormProps {
  amount: string;
  setAmount: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  paymentMethod: "credit-card" | "bank";
  setPaymentMethod: (value: "credit-card" | "bank") => void;
  emailSent: boolean;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: () => void;
  handleSendBankTransferEmail: () => void;
  transferCode: string;
  setTransferCode: (value: string) => void;
  processingVerification: boolean;
  handleNotifyBankTransfer: () => void;
  isValidAmount: boolean;
  isEmailValid: boolean;
  isLoading: boolean;
}

// プレゼンテーションコンポーネント: フォームUIを担当
const ChargeInputForm = React.memo(
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
              disabled={!isValidAmount}
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

export default ChargeInputForm;
