// src/components/settings/tabs/SecurityTab.tsx（リファクタリング版）
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Session } from "next-auth";
import {
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Laptop,
  LogOut,
  Fingerprint,
} from "lucide-react";
import { SettingSection } from "../SettingSection";

interface SecurityTabProps {
  user?: Session["user"];
}

export function SecurityTab({ user }: SecurityTabProps) {
  // パスワードの表示/非表示を管理する状態
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // フォーム状態（簡易的な実装）
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  // パスワード変更のハンドラー
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("すべての項目を入力してください");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("新しいパスワードが一致しません");
      return;
    }

    if (newPassword.length < 8) {
      setFormError("パスワードは8文字以上である必要があります");
      return;
    }

    // パスワード変更処理（実際のアプリではAPI呼び出しなど）
    console.log("パスワード変更処理");
    setFormError("");
  };

  return (
    <div className="space-y-6">
      {/* パスワード変更セクション */}
      <form onSubmit={handlePasswordChange}>
        <SettingSection
          title="パスワード変更"
          icon={<Shield className="h-4 w-4 text-teal-700" />}
          description={`${user?.email || "eco_user@example.com"} アカウントのパスワード変更`}
        >
          <div className="space-y-3">
            {/* 現在のパスワード */}
            <div className="space-y-2">
              <Label
                htmlFor="current-password"
                className="text-sm text-stone-700"
              >
                現在のパスワード
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  className="border-stone-200 pr-10"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "パスワードを隠す" : "パスワードを表示"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 新しいパスワード */}
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm text-stone-700">
                新しいパスワード
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  className="border-stone-200 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? "パスワードを隠す" : "パスワードを表示"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                8文字以上で、数字と記号を含めてください
              </p>
            </div>

            {/* 新しいパスワード（確認） */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm text-stone-700"
              >
                新しいパスワード（確認）
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="border-stone-200 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "パスワードを隠す"
                      : "パスワードを表示"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {formError && (
            <div
              className="text-red-600 text-sm bg-red-50 p-2 rounded-md mt-3"
              role="alert"
            >
              {formError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-3"
          >
            パスワードを変更
          </Button>
        </SettingSection>
      </form>

      <Separator className="my-6" />

      {/* 二段階認証セクション */}
      <SettingSection
        title="二段階認証"
        icon={<Shield className="h-4 w-4 text-teal-700" />}
      >
        <Card className="border border-stone-200 p-4 bg-stone-50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="2fa"
                className="text-sm font-medium text-stone-800"
              >
                二段階認証を有効化
              </Label>
              <p className="text-xs text-stone-500">
                ログイン時に確認コードが必要になります
              </p>
            </div>
            <Switch id="2fa" defaultChecked aria-label="二段階認証を有効化" />
          </div>
        </Card>

        <Card className="border border-stone-200 p-4 bg-stone-50 mt-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="biometric"
                className="text-sm font-medium text-stone-800"
              >
                <div className="flex items-center">
                  <Fingerprint className="h-4 w-4 text-stone-600 mr-2" />
                  生体認証
                </div>
              </Label>
              <p className="text-xs text-stone-500">
                指紋または顔認証でログインできます
              </p>
            </div>
            <Switch
              id="biometric"
              defaultChecked
              aria-label="生体認証を有効化"
            />
          </div>
        </Card>
      </SettingSection>

      <Separator className="my-6" />

      {/* デバイス管理セクション */}
      <SettingSection
        title="デバイス管理"
        icon={<Smartphone className="h-4 w-4 text-teal-700" />}
      >
        <Card className="border border-stone-200 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-teal-700" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-stone-800">
                  iPhone 13 Pro
                </h4>
                <p className="text-xs text-stone-500">
                  最終ログイン: 2025/04/20 10:23
                </p>
              </div>
            </div>
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
              現在のデバイス
            </Badge>
          </div>
        </Card>

        <Card className="border border-stone-200 p-4 shadow-sm mt-3">
          <div className="flex justify-between items-center">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 w-8 h-8 bg-stone-50 rounded-full flex items-center justify-center">
                <Laptop className="h-4 w-4 text-stone-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-stone-800">
                  MacBook Pro
                </h4>
                <p className="text-xs text-stone-500">
                  最終ログイン: 2025/04/19 18:45
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              解除
            </Button>
          </div>
        </Card>
      </SettingSection>

      <Button
        variant="outline"
        className="w-full mt-6 text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center"
      >
        <LogOut className="h-4 w-4 mr-2" />
        すべてのデバイスからログアウト
      </Button>
    </div>
  );
}
