import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTransferSection } from "./BankTransferSection";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { validateAmount } from "@/lib/utils/validation";
import { isValidEmail } from "@/lib/utils/validation";

interface ChargeStepInputProps {
  amount: string;
  setAmount: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  paymentMethod: "credit-card" | "bank";
  setPaymentMethod: (value: "credit-card" | "bank") => void;
  emailSent: boolean;
  setEmailSent: (value: boolean) => void;
  isLoading: boolean;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: () => void;
  handleSendBankTransferEmail: () => void;
  transferCode: string;
  setTransferCode: (value: string) => void;
  processingVerification: boolean;
  handleNotifyBankTransfer: () => void;
}

export function ChargeStepInput({
  amount,
  setAmount,
  email,
  setEmail,
  paymentMethod,
  setPaymentMethod,
  emailSent,
  setEmailSent,
  isLoading,
  error,
  handleSelectAmount,
  handleProceedToConfirm,
  handleSendBankTransferEmail,
  transferCode,
  setTransferCode,
  processingVerification,
  handleNotifyBankTransfer,
}: ChargeStepInputProps) {
  // ユーティリティ関数を使用したバリデーション
  const amountValidation = validateAmount(amount);
  const isValidAmount = amountValidation.isValid;

  // メールアドレスのバリデーション
  const isEmailValid = isValidEmail(email);

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
                setPaymentMethod(value);
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
            <TabsTrigger value="bank" className="text-sm" disabled={emailSent}>
              銀行振込
            </TabsTrigger>
          </TabsList>
          <TabsContent value="credit-card" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-stone-800"
              >
                チャージ金額
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="5,000"
                  className="border-stone-300"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="text-sm text-stone-600">円</span>
              </div>
            </div>

            <div className="flex justify-between text-sm text-stone-600 px-1">
              <span>おすすめ金額:</span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
                  onClick={() => handleSelectAmount("5000")}
                >
                  5,000円
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
                  onClick={() => handleSelectAmount("10000")}
                >
                  10,000円
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 pt-4">
            <BankTransferSection
              email={email}
              setEmail={setEmail}
              amount={amount}
              setAmount={setAmount}
              emailSent={emailSent}
              setEmailSent={setEmailSent}
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
}
