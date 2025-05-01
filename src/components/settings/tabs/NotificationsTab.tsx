import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";
import { SettingSection } from "../SettingSection";
import { Bell, Mail, ShoppingBag, Leaf, AlertTriangle } from "lucide-react";

interface NotificationsTabProps {
  user?: Session["user"];
}

export function NotificationsTab({ user }: NotificationsTabProps) {
  return (
    <div className="space-y-4">
      {/* 通知設定セクション */}
      <SettingSection
        title="通知設定"
        icon={<Bell className="h-4 w-4 text-stone-600" />}
      >
        {/* 取引通知 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify1" className="text-sm text-stone-800">
              <div className="flex items-center">
                <ShoppingBag className="h-4 w-4 text-stone-600 mr-2" />
                取引通知
              </div>
            </Label>
            <p className="text-xs text-stone-500 ml-6">
              入金・支払い時に通知を受け取ります
            </p>
          </div>
          <Switch id="notify1" defaultChecked />
        </div>

        {/* 環境貢献通知 */}
        <div className="flex items-center justify-between mt-3">
          <div className="space-y-0.5">
            <Label htmlFor="notify2" className="text-sm text-stone-800">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 text-teal-600 mr-2" />
                環境貢献通知
              </div>
            </Label>
            <p className="text-xs text-stone-500 ml-6">
              あなたの環境貢献が特定のマイルストーンに達した際に通知します
            </p>
          </div>
          <Switch id="notify2" defaultChecked />
        </div>

        {/* キャンペーン情報 */}
        <div className="flex items-center justify-between mt-3">
          <div className="space-y-0.5">
            <Label htmlFor="notify3" className="text-sm text-stone-800">
              <div className="flex items-center">
                <Bell className="h-4 w-4 text-amber-500 mr-2" />
                キャンペーン情報
              </div>
            </Label>
            <p className="text-xs text-stone-500 ml-6">
              環境保全キャンペーンやイベントの情報を受け取ります
            </p>
          </div>
          <Switch id="notify3" defaultChecked />
        </div>

        {/* セキュリティ通知 */}
        <div className="flex items-center justify-between mt-3">
          <div className="space-y-0.5">
            <Label htmlFor="notify4" className="text-sm text-stone-800">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                セキュリティ通知
              </div>
            </Label>
            <p className="text-xs text-stone-500 ml-6">
              ログインやアカウント変更時に通知を受け取ります
            </p>
          </div>
          <Switch id="notify4" defaultChecked />
        </div>
      </SettingSection>

      <Separator />

      {/* メールアドレス設定セクション */}
      <SettingSection
        title="通知メールアドレス"
        icon={<Mail className="h-4 w-4 text-stone-600" />}
      >
        <div className="space-y-2">
          <Input
            id="notify-email"
            defaultValue={user?.email || "eco_user@example.com"}
            className="border-stone-200"
          />
          <p className="text-xs text-stone-500 mt-1">
            通知の受信に使用するメールアドレスです
          </p>
        </div>
      </SettingSection>

      <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
        設定を保存
      </Button>
    </div>
  );
}
