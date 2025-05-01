import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Wallet, RefreshCw } from "lucide-react";
import { Session } from "next-auth";
import { SettingSection } from "../SettingSection";

interface PaymentTabProps {
  user?: Session["user"];
}

export function PaymentTab({ user }: PaymentTabProps) {
  const recommendedChargeAmount =
    user?.balance && user.balance < 5000
      ? Math.max(5000, Math.ceil((user.balance * 0.5) / 1000) * 1000)
      : 5000;

  return (
    <div className="space-y-4">
      {/* 残高表示 */}
      <div className="text-xs text-stone-600 mb-2">
        {user?.name || "ユーザー"}さんの現在の残高: ¥
        {user?.balance?.toLocaleString() || "8,500"}
      </div>

      {/* 支払い方法セクション */}
      <SettingSection
        title="支払い方法"
        icon={<CreditCard className="h-4 w-4 text-stone-600" />}
      >
        <div className="space-y-3">
          {/* VISAカード */}
          <div className="border border-stone-200 rounded-md p-4 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-800">
                    VISAカード
                  </h4>
                  <p className="text-xs text-stone-500">**** **** **** 4567</p>
                </div>
              </div>
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                デフォルト
              </Badge>
            </div>
          </div>

          {/* MASTERカード */}
          <div className="border border-stone-200 rounded-md p-4 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-800">
                    MASTERカード
                  </h4>
                  <p className="text-xs text-stone-500">**** **** **** 8901</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-stone-500"
              >
                編集
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full text-stone-700 border-stone-200 mt-2"
        >
          新しい支払い方法を追加
        </Button>
      </SettingSection>

      <Separator />

      {/* チャージ設定セクション */}
      <SettingSection
        title="チャージ設定"
        icon={<Wallet className="h-4 w-4 text-stone-600" />}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-charge" className="text-sm text-stone-800">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 text-stone-600 mr-2" />
                自動チャージ
              </div>
            </Label>
            <p className="text-xs text-stone-500 ml-6">
              残高が指定額以下になると自動的にチャージされます
            </p>
          </div>
          <Switch id="auto-charge" />
        </div>

        <div className="flex space-x-3 mt-3">
          <div className="w-1/2">
            <Label htmlFor="min-balance" className="text-xs text-stone-600">
              チャージ実行残高
            </Label>
            <div className="flex items-center">
              <Input
                id="min-balance"
                defaultValue="1000"
                className="border-stone-200"
                disabled
              />
              <span className="ml-1 text-sm text-stone-600">円以下</span>
            </div>
          </div>
          <div className="w-1/2">
            <Label htmlFor="charge-amount" className="text-xs text-stone-600">
              チャージ金額
            </Label>
            <div className="flex items-center">
              <Input
                id="charge-amount"
                defaultValue={recommendedChargeAmount.toString()}
                className="border-stone-200"
                disabled
              />
              <span className="ml-1 text-sm text-stone-600">円</span>
            </div>
          </div>
        </div>
      </SettingSection>

      <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
        設定を保存
      </Button>
    </div>
  );
}
