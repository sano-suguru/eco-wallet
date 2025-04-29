import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";

interface NotificationsTabProps {
  user?: Session["user"];
}

export function NotificationsTab({ user }: NotificationsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-stone-800">通知設定</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify1" className="text-sm text-stone-800">
              取引通知
            </Label>
            <p className="text-xs text-stone-500">
              入金・支払い時に通知を受け取ります
            </p>
          </div>
          <Switch id="notify1" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify2" className="text-sm text-stone-800">
              環境貢献通知
            </Label>
            <p className="text-xs text-stone-500">
              あなたの環境貢献が特定のマイルストーンに達した際に通知します
            </p>
          </div>
          <Switch id="notify2" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify3" className="text-sm text-stone-800">
              キャンペーン情報
            </Label>
            <p className="text-xs text-stone-500">
              環境保全キャンペーンやイベントの情報を受け取ります
            </p>
          </div>
          <Switch id="notify3" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notify4" className="text-sm text-stone-800">
              セキュリティ通知
            </Label>
            <p className="text-xs text-stone-500">
              ログインやアカウント変更時に通知を受け取ります
            </p>
          </div>
          <Switch id="notify4" defaultChecked />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label
          htmlFor="notify-email"
          className="text-sm font-medium text-stone-800"
        >
          通知メールアドレス
        </Label>
        <Input
          id="notify-email"
          defaultValue={user?.email || "eco_user@example.com"}
          className="border-stone-200"
        />
        <p className="text-xs text-stone-500 mt-1">
          通知の受信に使用するメールアドレスです
        </p>
      </div>

      <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
        設定を保存
      </Button>
    </div>
  );
}
