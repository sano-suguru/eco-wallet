import { ProjectCard } from "./ProjectCard";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { Leaf } from "lucide-react";

interface DonateStepInputProps {
  amount: string;
  setAmount: (value: string) => void;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  error: string | null;
  handleSelectAmount: (value: string) => void;
  handleProceedToConfirm: () => void;
  balance: number;
}

export function DonateStepInput({
  amount,
  setAmount,
  selectedProject,
  setSelectedProject,
  error,
  handleSelectAmount,
  handleProceedToConfirm,
  balance,
}: DonateStepInputProps) {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-teal-800">寄付先を選択</CardTitle>
        <CardDescription>
          環境保全プロジェクトを選んで寄付しましょう
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectCard
            id="mountain"
            title="山岳環境保全プロジェクト"
            description="登山道の整備や森林再生などを通じて山岳環境の保全を目指します"
            currentFunding={4500}
            targetFunding={10000}
            imageType="mountain"
            selected={selectedProject === "mountain"}
            onSelect={() => setSelectedProject("mountain")}
          />

          <ProjectCard
            id="ocean"
            title="海洋プラスチック削減イニシアチブ"
            description="海洋プラスチックの削減と海岸の清掃活動を通じて海の生態系を守ります"
            currentFunding={7950}
            targetFunding={15000}
            imageType="ocean"
            selected={selectedProject === "ocean"}
            onSelect={() => setSelectedProject("ocean")}
          />
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
