import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Leaf } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-800">
          環境貢献の優先順位
        </h3>
        <div className="text-xs text-teal-700 mb-2">
          {user?.name || "ユーザー"}さんは現在「
          {user?.ecoRank || "エコビギナー"}」ランクです
        </div>
        <RadioGroup defaultValue={defaultEcoOption} className="space-y-3">
          <div className="flex items-start space-x-3 bg-stone-50 p-3 rounded-md">
            <RadioGroupItem value="forest" id="forest" className="mt-1" />
            <div>
              <Label
                htmlFor="forest"
                className="text-sm font-medium text-stone-800"
              >
                森林保全を優先
              </Label>
              <p className="text-xs text-stone-600 mt-1">
                寄付金は主に山岳地域の森林保全活動に使用されます
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-stone-50 p-3 rounded-md">
            <RadioGroupItem value="ocean" id="ocean" className="mt-1" />
            <div>
              <Label
                htmlFor="ocean"
                className="text-sm font-medium text-stone-800"
              >
                海洋保全を優先
              </Label>
              <p className="text-xs text-stone-600 mt-1">
                寄付金は主に海洋プラスチック削減と海岸の清掃活動に使用されます
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-stone-50 p-3 rounded-md">
            <RadioGroupItem value="climate" id="climate" className="mt-1" />
            <div>
              <Label
                htmlFor="climate"
                className="text-sm font-medium text-stone-800"
              >
                気候変動対策を優先
              </Label>
              <p className="text-xs text-stone-600 mt-1">
                寄付金は主に再生可能エネルギー促進とCO2削減活動に使用されます
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-800">
          環境貢献オプション
        </h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="eco-option1" className="text-sm text-stone-800">
              決済時の寄付オプションを常に有効化
            </Label>
            <p className="text-xs text-stone-500">
              決済額の1%が自動的に環境保全に寄付されます
            </p>
          </div>
          <Switch id="eco-option1" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="eco-option2" className="text-sm text-stone-800">
              紙のレシートを辞退
            </Label>
            <p className="text-xs text-stone-500">
              電子レシートのみを受け取ります
            </p>
          </div>
          <Switch id="eco-option2" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="eco-option3" className="text-sm text-stone-800">
              環境貢献レポートを受け取る
            </Label>
            <p className="text-xs text-stone-500">
              月に一度、あなたの環境貢献の詳細レポートを受け取ります
            </p>
          </div>
          <Switch id="eco-option3" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="eco-option4" className="text-sm text-stone-800">
              環境関連のお知らせを優先表示
            </Label>
            <p className="text-xs text-stone-500">
              環境保全活動に関する最新情報を優先的に受け取ります
            </p>
          </div>
          <Switch id="eco-option4" defaultChecked />
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-md p-3 mt-4">
        <div className="flex items-start space-x-3">
          <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-teal-800">
              環境貢献をさらに高める
            </h4>
            <p className="text-xs text-teal-700 mt-1">
              決済額からの寄付比率を増やすことで、より大きな環境インパクトを生み出せます
            </p>
            <Select defaultValue="1">
              <SelectTrigger className="mt-2 border-teal-200 bg-white">
                <SelectValue placeholder="寄付比率を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1% (デフォルト)</SelectItem>
                <SelectItem value="3">3%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
        設定を保存
      </Button>
    </div>
  );
}
