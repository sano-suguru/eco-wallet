"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Leaf } from "lucide-react";

/**
 * 銀行振込セクションのプロパティ
 */
export interface BankTransferSectionProps {
  /** メールアドレス */
  email: string;
  /** メールアドレス更新関数 */
  setEmail: (value: string) => void;
  /** 振込金額 */
  amount: string;
  /** 振込金額更新関数 */
  setAmount: (value: string) => void;
  /** メール送信済みフラグ */
  emailSent: boolean;
  /** メール送信済みフラグ更新関数 */
  setEmailSent: (value: boolean) => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** メールアドレス有効性 */
  isValidEmail: boolean;
  /** 金額有効性 */
  isValidAmount: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 金額選択ハンドラー */
  handleSelectAmount: (value: string) => void;
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
}

/**
 * 銀行振込用の入力と表示を行うコンポーネント
 */
export function BankTransferSection({
  email,
  setEmail,
  amount,
  setAmount,
  emailSent,
  setEmailSent,
  isLoading,
  isValidEmail,
  isValidAmount,
  error,
  handleSelectAmount,
  handleSendBankTransferEmail,
  transferCode,
  setTransferCode,
  processingVerification,
  handleNotifyBankTransfer,
}: BankTransferSectionProps) {
  /**
   * メール入力フォームの表示
   */
  const renderEmailForm = () => (
    <>
      <div className="text-sm text-stone-700 space-y-2">
        <p>銀行振込の詳細を送信するメールアドレスを入力してください:</p>
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
        disabled={isLoading || !isValidEmail || !isValidAmount}
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
  );

  /**
   * 振込情報の表示
   */
  const renderTransferInfo = () => (
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
          <div>振込金額: ¥{Number(amount).toLocaleString()}</div>
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
        <p>振込完了後、通常1-2営業日以内に自動的に残高に反映されます。</p>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md mt-2">
            {error}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full text-stone-600 mt-3"
        onClick={handleNotifyBankTransfer}
        disabled={processingVerification}
      >
        {processingVerification ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-stone-600 rounded-full"></div>
            確認中...
          </>
        ) : (
          "反映されない場合はこちらをお試しください"
        )}
      </Button>

      <Button
        variant="ghost"
        className="w-full text-stone-500 mt-2"
        onClick={() => {
          setEmailSent(false);
          setTransferCode("");
        }}
        disabled={processingVerification}
      >
        振込情報をやり直す
      </Button>
    </>
  );

  // メール送信前か送信後かで表示を切り替え
  return emailSent ? renderTransferInfo() : renderEmailForm();
}
