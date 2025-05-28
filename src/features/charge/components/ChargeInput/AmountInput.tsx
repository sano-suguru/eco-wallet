"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { AppError } from "@/shared/types/errors";
import { ErrorDisplay } from "@/components/ui/error-display";

/**
 * 金額入力フォームのプロパティ（AppError型対応）
 */
export interface AmountInputProps {
  /** チャージ金額 */
  amount: string;
  /** チャージ金額更新関数 */
  setAmount: (value: string) => void;
  /** 金額選択ハンドラー */
  handleSelectAmount: (value: string) => void;
  /** エラー状態 */
  error: AppError | null;
}

/**
 * 金額入力フォームを表示するプレゼンテーションコンポーネント
 *
 * @param amount チャージ金額
 * @param setAmount チャージ金額更新関数
 * @param handleSelectAmount 金額選択ハンドラー
 * @param error エラーメッセージ
 */
export const AmountInput = React.memo(
  ({ amount, setAmount, handleSelectAmount, error }: AmountInputProps) => {
    const quickAmounts = [
      { value: "1000", label: "¥1,000" },
      { value: "3000", label: "¥3,000" },
      { value: "5000", label: "¥5,000" },
      { value: "10000", label: "¥10,000" },
    ];

    return (
      <div className="space-y-6">
        {/* 金額入力フィールド */}
        <div className="space-y-3">
          <Label
            htmlFor="amount"
            className="text-sm font-semibold text-stone-700 flex items-center"
          >
            <Wallet className="h-4 w-4 mr-2 text-teal-600" />
            チャージ金額
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-stone-600">
              ¥
            </span>
            <Input
              id="amount"
              type="number"
              placeholder="5,000"
              className="pl-10 pr-12 h-14 text-xl font-medium border-stone-200 focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-center"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-stone-600">
              円
            </span>
          </div>
        </div>

        {/* クイック金額選択 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-stone-600">クイック選択</p>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((quick) => (
              <Button
                key={quick.value}
                variant="outline"
                className={`
                  h-12 font-medium border-stone-200 hover:border-teal-300 hover:bg-teal-50 
                  transition-all duration-200
                  ${amount === quick.value ? "bg-teal-50 border-teal-300 text-teal-700" : ""}
                `}
                onClick={() => handleSelectAmount(quick.value)}
              >
                {quick.label}
              </Button>
            ))}
          </div>
        </div>

        {/* エラー表示 */}
        {error && <ErrorDisplay error={error} />}
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";
