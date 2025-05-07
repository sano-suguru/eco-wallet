import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { Leaf } from "lucide-react";
import { ProjectItem } from "@/lib/mock-data/news-projects";
import { Progress } from "@/components/ui/progress";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DonateProjectInputProps {
  project: ProjectItem;
  amount: string;
  setAmount: (value: string) => void;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: () => void;
  balance: number;
}

export function DonateProjectInput({
  project,
  amount,
  setAmount,
  error,
  handleSelectAmount,
  handleProceedToConfirm,
  balance,
}: DonateProjectInputProps) {
  // プロジェクトタイプに基づくアイコンの取得
  const getProjectIcon = () => {
    switch (project.imageType) {
      case "ocean":
        return (
          <svg
            className="h-16 w-16 text-blue-500 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12h20" />
            <path d="M5 12c.5-4.5 4-8 10-8" />
            <path d="M7 12c.5-2.5 2-5 5-5" />
            <path d="M19 12c-.5-4.5-4-8-10-8" />
            <path d="M17 12c-.5-2.5-2-5-5-5" />
            <path d="M2 12c0 4.5 3.5 8 8 9" />
            <path d="M22 12c0 4.5-3.5 8-8 9" />
          </svg>
        );
      case "mountain":
      default:
        return (
          <svg
            className="h-16 w-16 text-teal-700 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3v4l-4 4" />
            <path d="M4 11v4h4" />
            <path d="M4 15l6 6" />
            <path d="M14 15l6 6" />
            <path d="M8 21h8" />
            <path d="M16 3v4l4 4" />
            <path d="M20 11v4h-4" />
            <path d="M8 3h8" />
          </svg>
        );
    }
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-teal-800">{project.title}</CardTitle>
        <CardDescription>
          このプロジェクトへの寄付で環境保全に貢献できます
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getProjectIcon()}</div>
            <div>
              <p className="text-sm text-teal-800">{project.description}</p>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600">進捗状況</span>
                  <span className="text-teal-700 font-medium">
                    {project.progressPercent}%
                  </span>
                </div>
                <Progress
                  value={project.progressPercent}
                  className="h-1.5 bg-teal-100"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-teal-800 font-medium">
                    ¥{project.currentFunding.toLocaleString()}
                  </span>
                  <span className="text-stone-500">
                    目標: ¥{project.targetFunding.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <div className="flex justify-between text-sm text-stone-600 px-1">
          <span>おすすめ金額:</span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
              onClick={() => handleSelectAmount("1000")}
            >
              1,000円
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
              onClick={() => handleSelectAmount("5000")}
            >
              5,000円
            </Button>
          </div>
        </div>

        <div className="bg-teal-50 p-3 rounded-md border border-teal-100">
          <div className="flex items-start">
            <Leaf className="h-4 w-4 text-teal-600 mt-0.5 mr-2" />
            <div className="text-xs text-teal-700">
              あなたの寄付は、直接環境保全活動に使われます。寄付によって得られる具体的な環境貢献効果は寄付完了後に確認できます。
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}

        <Button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          onClick={handleProceedToConfirm}
        >
          次へ進む
        </Button>
      </CardContent>
    </>
  );
}
