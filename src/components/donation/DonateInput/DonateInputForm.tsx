"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/common";
import { Leaf } from "lucide-react";
import { ProjectItem } from "@/lib/mock-data/news-projects";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ProjectInfo from "./ProjectInfo";
import AmountSelector from "./AmountSelector";

interface DonateInputFormProps {
  project: ProjectItem;
  amount: string;
  setAmount: (value: string) => void;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: () => void;
  balance: number;
}

// プレゼンテーションコンポーネント: フォームUIのみを担当
const DonateInputForm = React.memo(
  ({
    project,
    amount,
    setAmount,
    error,
    handleSelectAmount,
    handleProceedToConfirm,
    balance,
  }: DonateInputFormProps) => {
    return (
      <>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-teal-800">
            {project.title}
          </CardTitle>
          <CardDescription>
            このプロジェクトへの寄付で環境保全に貢献できます
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* プロジェクト情報 */}
          <ProjectInfo project={project} />

          {/* 金額入力部分 */}
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-stone-800"
            >
              寄付金額
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="amount"
                type="number"
                placeholder="1,000"
                className="border-stone-300"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="text-sm text-stone-600">円</span>
            </div>
            <p className="text-xs text-stone-500">
              残高: {formatCurrency(balance)}
            </p>
          </div>

          {/* 金額クイック選択 */}
          <AmountSelector onSelectAmount={handleSelectAmount} />

          {/* 環境情報説明 */}
          <div className="bg-teal-50 p-3 rounded-md border border-teal-100">
            <div className="flex items-start">
              <Leaf className="h-4 w-4 text-teal-600 mt-0.5 mr-2" />
              <div className="text-xs text-teal-700">
                あなたの寄付は、直接環境保全活動に使われます。寄付によって得られる具体的な環境貢献効果は寄付完了後に確認できます。
              </div>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          {/* 送信ボタン */}
          <Button
            className="w-full bg-teal-700 hover:bg-teal-800 text-white"
            onClick={handleProceedToConfirm}
          >
            次へ進む
          </Button>
        </CardContent>
      </>
    );
  },
);

DonateInputForm.displayName = "DonateInputForm";

export default DonateInputForm;
