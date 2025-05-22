"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * 金額入力フォームのプロパティ
 */
export interface AmountInputProps {
  /** チャージ金額 */
  amount: string;
  /** チャージ金額更新関数 */
  setAmount: (value: string) => void;
  /** 金額選択ハンドラー */
  handleSelectAmount: (value: string) => void;
  /** エラーメッセージ */
  error: string | null;
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
    return (
      <div className="space-y-4">
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
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";
