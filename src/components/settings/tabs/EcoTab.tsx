"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Leaf,
  TreePine,
  Droplets,
  Globe,
  CheckCircle,
  Info,
} from "lucide-react";
import { Session } from "next-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EcoTabProps {
  user?: Session["user"];
}

export function EcoTab({ user }: EcoTabProps) {
  // ユーザーのエコランクに基づいて初期値を設定
  const defaultEcoOption =
    user?.ecoRank === "エコマイスター" || user?.ecoRank === "エコチャンピオン"
      ? "climate"
      : "forest";

  // 設定の状態管理
  const [isSaved, setIsSaved] = useState(false);
  const [donationPercentage, setDonationPercentage] = useState("1");

  // 設定保存のハンドラー
  const handleSaveSettings = () => {
    setIsSaved(true);
    // 実際のアプリではここでAPI呼び出しなど

    // 一定時間後に保存完了通知を非表示
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* ユーザーエコランク表示 */}
      <div className="flex items-center space-x-3 bg-teal-50 p-4 rounded-md border border-teal-100">
        <Leaf className="h-6 w-6 text-teal-700" />
        <div>
          <h3 className="text-sm font-medium text-teal-800">
            あなたの環境貢献ステータス
          </h3>
          <div className="flex items-center mt-1">
            <span className="text-xs text-teal-700 mr-2">
              {user?.name || "ユーザー"}さんは現在
            </span>
            <Badge className="bg-teal-100 text-teal-800">
              {user?.ecoRank || "エコビギナー"}
            </Badge>
            <span className="text-xs text-teal-700 ml-2">ランクです</span>
          </div>
        </div>
      </div>

      {/* 保存完了通知 */}
      {isSaved && (
        <div
          className="flex items-center bg-green-50 p-3 rounded-md border border-green-100"
          role="alert"
        >
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          <p className="text-sm text-green-700">設定が保存されました</p>
        </div>
      )}

      {/* 環境貢献の優先順位セクション */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TreePine className="h-4 w-4 text-teal-700" />
          <h3 className="text-sm font-medium text-stone-800">
            環境貢献の優先順位
          </h3>
        </div>

        <div className="text-xs text-stone-600 mb-2">
          貢献したい環境保全活動の優先順位を選択してください
        </div>

        <RadioGroup defaultValue={defaultEcoOption} className="space-y-3">
          <Card className="border border-stone-200 p-4 hover:border-teal-200 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <RadioGroupItem
                value="forest"
                id="forest"
                className="mt-1"
                aria-label="森林保全を優先"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <TreePine className="h-4 w-4 text-teal-700 mr-2" />
                  <Label
                    htmlFor="forest"
                    className="text-sm font-medium text-stone-800 cursor-pointer"
                  >
                    森林保全を優先
                  </Label>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  寄付金は主に山岳地域の森林保全活動に使用されます。この選択により、年間約2m²の森林面積が保全されます。
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-stone-200 p-4 hover:border-teal-200 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <RadioGroupItem
                value="ocean"
                id="ocean"
                className="mt-1"
                aria-label="海洋保全を優先"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                  <Label
                    htmlFor="ocean"
                    className="text-sm font-medium text-stone-800 cursor-pointer"
                  >
                    海洋保全を優先
                  </Label>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  寄付金は主に海洋プラスチック削減と海岸の清掃活動に使用されます。この選択により、年間約5kgのプラスチックが削減されます。
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-stone-200 p-4 hover:border-teal-200 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <RadioGroupItem
                value="climate"
                id="climate"
                className="mt-1"
                aria-label="気候変動対策を優先"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-green-600 mr-2" />
                  <Label
                    htmlFor="climate"
                    className="text-sm font-medium text-stone-800 cursor-pointer"
                  >
                    気候変動対策を優先
                  </Label>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  寄付金は主に再生可能エネルギー促進とCO2削減活動に使用されます。この選択により、年間約15kgのCO2削減に貢献します。
                </p>
              </div>
            </div>
          </Card>
        </RadioGroup>
      </div>

      <Separator className="my-6" />

      {/* 環境貢献オプションセクション */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Leaf className="h-4 w-4 text-teal-700" />
          <h3 className="text-sm font-medium text-stone-800">
            環境貢献オプション
          </h3>
        </div>

        <Card className="border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="eco-option1"
                className="text-sm font-medium text-stone-800"
              >
                決済時の寄付オプションを常に有効化
              </Label>
              <p className="text-xs text-stone-500">
                決済額の1%が自動的に環境保全に寄付されます
              </p>
            </div>
            <Switch
              id="eco-option1"
              defaultChecked
              aria-label="決済時の寄付オプションを常に有効化"
            />
          </div>
        </Card>

        <Card className="border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="eco-option2"
                className="text-sm font-medium text-stone-800"
              >
                紙のレシートを辞退
              </Label>
              <p className="text-xs text-stone-500">
                電子レシートのみを受け取ります
              </p>
            </div>
            <Switch
              id="eco-option2"
              defaultChecked
              aria-label="紙のレシートを辞退"
            />
          </div>
        </Card>

        <Card className="border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="eco-option3"
                className="text-sm font-medium text-stone-800"
              >
                環境貢献レポートを受け取る
              </Label>
              <p className="text-xs text-stone-500">
                月に一度、あなたの環境貢献の詳細レポートを受け取ります
              </p>
            </div>
            <Switch
              id="eco-option3"
              defaultChecked
              aria-label="環境貢献レポートを受け取る"
            />
          </div>
        </Card>

        <Card className="border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="eco-option4"
                className="text-sm font-medium text-stone-800"
              >
                環境関連のお知らせを優先表示
              </Label>
              <p className="text-xs text-stone-500">
                環境保全活動に関する最新情報を優先的に受け取ります
              </p>
            </div>
            <Switch
              id="eco-option4"
              defaultChecked
              aria-label="環境関連のお知らせを優先表示"
            />
          </div>
        </Card>
      </div>

      {/* 寄付比率設定セクション */}
      <Card className="bg-teal-50 border border-teal-100 p-4 mt-6">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 bg-teal-100 p-1.5 rounded-full">
            <Leaf className="h-4 w-4 text-teal-700" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-teal-800">
              環境貢献をさらに高める
            </h4>
            <p className="text-xs text-teal-700 mt-1">
              決済額からの寄付比率を増やすことで、より大きな環境インパクトを生み出せます
            </p>

            <div className="mt-3 relative">
              <Select
                defaultValue={donationPercentage}
                onValueChange={setDonationPercentage}
              >
                <SelectTrigger className="border-teal-200 bg-white">
                  <SelectValue placeholder="寄付比率を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1% (デフォルト)</SelectItem>
                  <SelectItem value="3">3%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-2 flex items-center text-xs text-teal-700">
                <Info className="h-3 w-3 mr-1" />
                <span>
                  {donationPercentage}%の寄付で、1ヶ月あたり約
                  {Number(donationPercentage) * 120}円の環境保全に貢献できます
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Button
        className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-6"
        onClick={handleSaveSettings}
      >
        設定を保存
      </Button>
    </div>
  );
}
