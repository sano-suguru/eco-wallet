"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ErrorDisplay } from "@/components/ui/error-display";
import { RecipientSelectorModal } from "../RecipientSelector";
import { SuccessMessage } from "../SuccessMessage";
import { useTransferForm } from "../../hooks/useTransferForm";
import { formatCurrency } from "@/shared/utils/formats";
import { Recipient } from "../../types/transfer";

export const TransferForm = () => {
  const {
    formData,
    updateField,
    selectRecipient,
    handleTransfer,
    isProcessing,
    error,
    fieldErrors,
    isSuccess,
    transferAmount,
    donationAmount,
    totalAmount,
  } = useTransferForm();

  const [showRecipientSelector, setShowRecipientSelector] = useState(false);

  const handleRecipientSelect = (recipient: Recipient) => {
    selectRecipient(recipient);
    setShowRecipientSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTransfer();
  };

  // 成功メッセージを表示
  if (isSuccess) {
    return (
      <SuccessMessage
        recipientName={formData.selectedRecipient?.name || formData.recipient}
        transferAmount={transferAmount}
        donationAmount={donationAmount}
        totalDeduction={totalAmount}
      />
    );
  }

  return (
    <>
      {/* 受取人選択モーダル */}
      <RecipientSelectorModal
        isOpen={showRecipientSelector}
        onSelectRecipient={handleRecipientSelect}
        onClose={() => setShowRecipientSelector(false)}
      />

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>送金</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 受取人選択 */}
            <div className="space-y-2">
              <Label htmlFor="recipient">受取人</Label>
              <div className="flex gap-2">
                <Input
                  id="recipient"
                  type="text"
                  placeholder="受取人を選択してください"
                  value={formData.recipient}
                  onChange={(e) => updateField("recipient", e.target.value)}
                  className="flex-1"
                  readOnly={!!formData.selectedRecipient}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecipientSelector(true)}
                  className="shrink-0"
                >
                  選択
                </Button>
              </div>
              {formData.selectedRecipient && (
                <p className="text-sm text-stone-600">
                  {formData.selectedRecipient.isEcoUser
                    ? "Eco Walletユーザー"
                    : "外部ユーザー"}
                </p>
              )}
              {fieldErrors.recipient && (
                <ErrorDisplay error={fieldErrors.recipient} />
              )}
            </div>

            {/* 金額入力 */}
            <div className="space-y-2">
              <Label htmlFor="amount">金額</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
                  ¥
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  className="pl-8"
                  min="1"
                  required
                />
              </div>
              {fieldErrors.amount && (
                <ErrorDisplay error={fieldErrors.amount} />
              )}
            </div>

            {/* メッセージ入力 */}
            <div className="space-y-2">
              <Label htmlFor="message">メッセージ（任意）</Label>
              <Textarea
                id="message"
                placeholder="メッセージを入力"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateField("message", e.target.value)
                }
                rows={3}
                className="resize-none"
              />
            </div>

            {/* 環境保全寄付 */}
            <div className="flex items-start space-x-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <Checkbox
                id="donate"
                checked={formData.isDonateChecked}
                onCheckedChange={(checked) =>
                  updateField("isDonateChecked", checked as boolean)
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor="donate"
                  className="flex items-center gap-2 text-sm font-medium text-teal-800 cursor-pointer"
                >
                  <Leaf className="h-4 w-4" />
                  環境保全に寄付する
                </Label>
                <p className="text-xs text-teal-600 mt-1">
                  送金額の1%を環境保全活動に寄付します
                </p>
              </div>
            </div>

            {/* 金額内訳 */}
            {transferAmount > 0 && (
              <div className="space-y-2 p-4 bg-stone-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>送金額</span>
                  <span>{formatCurrency(transferAmount)}</span>
                </div>
                {formData.isDonateChecked && donationAmount > 0 && (
                  <div className="flex justify-between text-sm text-teal-600">
                    <span>環境保全寄付</span>
                    <span>{formatCurrency(donationAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex justify-between font-medium">
                    <span>合計</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* グローバルエラー表示 */}
            {error && <ErrorDisplay error={error} variant="banner" />}

            {/* 送金ボタン */}
            <Button
              type="submit"
              disabled={isProcessing || !formData.recipient || !formData.amount}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
            >
              {isProcessing ? "処理中..." : "送金する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
