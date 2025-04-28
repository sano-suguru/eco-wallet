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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, Leaf } from "lucide-react";
import { useSession } from "next-auth/react";

type ChargeStep = "input" | "confirm" | "complete";

export default function ChargePage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  // 基本状態
  const [currentStep, setCurrentStep] = useState<ChargeStep>("input");
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "bank">(
    "credit-card",
  );
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");

  // 銀行振込関連の状態
  const [email, setEmail] = useState<string>("");
  const [transferCode, setTransferCode] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [processingVerification, setProcessingVerification] =
    useState<boolean>(false);

  // バリデーション
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0;
  const isValidEmail = email && email.includes("@");

  // 金額選択ハンドラー
  const handleSelectAmount = (value: string) => {
    setAmount(value);
  };

  // 確認ステップへの移行
  const handleProceedToConfirm = () => {
    if (!isValidAmount) {
      setError("有効な金額を入力してください");
      return;
    }
    setError(null);
    setCurrentStep("confirm");
  };

  // 入力ステップに戻る
  const handleBackToInput = () => {
    setCurrentStep("input");
  };

  // クレジットカードチャージ処理のモック実装
  const handleConfirmCharge = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // モック処理として遅延を入れる
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // モックのトランザクションID生成
      const mockTransactionId = `TXN${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTransactionId);

      // セッションの残高を更新 (モック)
      if (session?.user) {
        const newBalance = (session.user.balance || 0) + Number(amount);
        // 本来はバックエンドからのレスポンスに基づいて更新する
        await update({ balance: newBalance });
      }

      setCurrentStep("complete");
    } catch {
      setError(
        "チャージ処理中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 振込情報取得処理（モック）
  const handleSendBankTransferEmail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // メール形式の簡易バリデーション
      if (!isValidEmail) {
        setError("有効なメールアドレスを入力してください");
        return;
      }

      // 金額のバリデーション
      if (!isValidAmount) {
        setError("有効な金額を入力してください");
        return;
      }

      // 振込コードの生成（実際はバックエンドで生成してDBに保存）
      const generatedCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setTransferCode(generatedCode);

      // メール送信をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 送信完了状態に更新
      setEmailSent(true);
    } catch {
      setError(
        "メール送信中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 振込完了通知処理（モック）
  const handleNotifyBankTransfer = async () => {
    setProcessingVerification(true);
    setError(null);

    try {
      // 振込確認をシミュレート（実際はバックエンドで照合）
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // モックのトランザクションID生成
      const mockTransactionId = `BNK${Date.now().toString().slice(-8)}`;
      setTransactionId(mockTransactionId);

      // セッションの残高を更新（モック）
      if (session?.user) {
        const newBalance = (session.user.balance || 0) + Number(amount);
        await update({ balance: newBalance });
      }

      // 完了ステップに進む
      setCurrentStep("complete");
    } catch {
      setError(
        "振込確認中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    } finally {
      setProcessingVerification(false);
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
          {currentStep === "input" && (
            // 入力ステップのUI
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-teal-800">
                  チャージ
                </CardTitle>
                <CardDescription>
                  あなたのアカウントにチャージします
                </CardDescription>
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
                      setPaymentMethod(value as "credit-card" | "bank");
                    }
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 bg-stone-100">
                    <TabsTrigger
                      value="credit-card"
                      className="text-sm"
                      disabled={emailSent} // 振込情報取得後は無効化
                    >
                      クレジットカード
                    </TabsTrigger>
                    <TabsTrigger
                      value="bank"
                      className="text-sm"
                      disabled={emailSent} // 振込情報取得後は無効化
                    >
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
                    {!emailSent ? (
                      <>
                        <div className="text-sm text-stone-700 space-y-2">
                          <p>
                            銀行振込の詳細を送信するメールアドレスを入力してください:
                          </p>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">
                              メールアドレス
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              className="border-stone-300"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bank-amount" className="text-sm">
                              振込金額
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="bank-amount"
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
                        </div>

                        <Button
                          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
                          onClick={handleSendBankTransferEmail}
                          disabled={
                            isLoading || !isValidEmail || !isValidAmount
                          }
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                              送信中...
                            </>
                          ) : (
                            "振込情報を取得する"
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-50 p-3 rounded-md border border-green-100 mb-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                            <div className="text-sm text-green-700">
                              メールを送信しました。以下の情報をもとに銀行振込を行ってください。
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-stone-700 space-y-2">
                          <p>以下の口座へお振込みください:</p>
                          <div className="bg-stone-100 p-3 rounded-md text-stone-800 font-mono text-xs">
                            <div>銀行名: エコバンク</div>
                            <div>支店名: 環境支店（001）</div>
                            <div>口座番号: 12345678</div>
                            <div>振込コード: {transferCode}</div>
                            <div>
                              振込金額: ¥{Number(amount).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-xs text-red-600 mt-2">
                            ※振込時の「お客様情報」欄に必ず上記の振込コードをご入力ください
                          </p>
                          <p className="text-xs text-teal-600 mt-2 flex items-center">
                            <Leaf className="h-3 w-3 mr-1" />
                            振込時に「エコ寄付」と入れていただくと、金額の1%が環境保全に寄付されます
                          </p>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-sm text-stone-700">
                          <p>
                            振込が完了したら下記ボタンを押して残高に反映させてください：
                          </p>

                          {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md mt-2">
                              {error}
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
                          onClick={handleNotifyBankTransfer}
                          disabled={processingVerification}
                        >
                          {processingVerification ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                              確認中...
                            </>
                          ) : (
                            "振込完了を通知する"
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full text-stone-600"
                          onClick={() => {
                            setEmailSent(false);
                            setTransferCode("");
                          }}
                          disabled={processingVerification}
                        >
                          振込情報をやり直す
                        </Button>
                      </>
                    )}
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
          )}

          {currentStep === "confirm" && (
            // 確認ステップのUI
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
                    <span className="text-sm text-stone-600">
                      チャージ方法:
                    </span>
                    <span className="text-sm font-medium text-stone-800">
                      {paymentMethod === "credit-card"
                        ? "クレジットカード"
                        : "銀行振込"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-stone-600">
                      チャージ金額:
                    </span>
                    <span className="text-lg font-bold text-teal-800">
                      ¥{Number(amount).toLocaleString()}
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600">
                      チャージ後残高:
                    </span>
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
                      Eco
                      Walletでは、全ての取引で環境に配慮した電子決済を採用し、
                      紙の使用を削減しています。また、チャージ金額の0.5%を自動的に環境保全団体へ寄付します。
                    </div>
                  </div>
                </div>
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
          )}

          {currentStep === "complete" && (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-teal-800">
                  チャージ完了
                </CardTitle>
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
                    現在の残高: ¥
                    {(session?.user?.balance || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-md w-full">
                  <div className="text-xs text-stone-600">
                    取引ID: {transactionId}
                  </div>
                  <div className="text-xs text-stone-600">
                    日時: {new Date().toLocaleString("ja-JP")}
                  </div>
                  {paymentMethod === "bank" && (
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
          )}
        </Card>

        <p className="text-xs text-center text-stone-500">
          このサービスは環境に配慮した素材で作られたサーバーで運用されています
        </p>
      </div>
    </div>
  );
}
