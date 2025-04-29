import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Session } from "next-auth";

interface SecurityTabProps {
  user?: Session["user"];
}

export function SecurityTab({ user }: SecurityTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-stone-800">パスワード変更</h3>

        <div className="text-xs text-stone-600 mb-2">
          {user?.email || "eco_user@example.com"} アカウントのパスワード変更
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-sm text-stone-800">
            現在のパスワード
          </Label>
          <Input
            id="current-password"
            type="password"
            className="border-stone-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm text-stone-800">
            新しいパスワード
          </Label>
          <Input
            id="new-password"
            type="password"
            className="border-stone-200"
          />
          <p className="text-xs text-stone-500 mt-1">
            8文字以上で、数字と記号を含めてください
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm text-stone-800">
            新しいパスワード（確認）
          </Label>
          <Input
            id="confirm-password"
            type="password"
            className="border-stone-200"
          />
        </div>

        <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
          パスワードを変更
        </Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-800">二段階認証</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa" className="text-sm text-stone-800">
              二段階認証を有効化
            </Label>
            <p className="text-xs text-stone-500">
              ログイン時に確認コードが必要になります
            </p>
          </div>
          <Switch id="2fa" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="biometric" className="text-sm text-stone-800">
              生体認証
            </Label>
            <p className="text-xs text-stone-500">
              指紋または顔認証でログインできます
            </p>
          </div>
          <Switch id="biometric" defaultChecked />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-800">デバイス管理</h3>

        <div className="border border-stone-200 rounded-md p-3 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-stone-800">
                iPhone 13 Pro
              </h4>
              <p className="text-xs text-stone-500">
                最終ログイン: 2025/04/20 10:23
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              現在のデバイス
            </Badge>
          </div>
        </div>

        <div className="border border-stone-200 rounded-md p-3 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-stone-800">
                MacBook Pro
              </h4>
              <p className="text-xs text-stone-500">
                最終ログイン: 2025/04/19 18:45
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-red-500"
            >
              解除
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full text-red-500 border-red-200 hover:bg-red-50 mt-4"
      >
        すべてのデバイスからログアウト
      </Button>
    </div>
  );
}
