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
import { SettingSection } from "@/features/settings/components/SettingSection";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { validateChangePasswordForm } from "@/features/auth/utils/validation";
import { ok, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";

interface SecurityTabProps {
  user?: Session["user"];
}

export function SecurityTab({ user }: SecurityTabProps) {
  // パスワードの表示/非表示を管理する状態
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // useAuthFormフックを使用してパスワード変更フォームを管理
  const passwordForm = useAuthForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validateForm: validateChangePasswordForm,
    onSubmit: async (values) => {
      try {
        // TODO: 実際のAPI呼び出し処理
        // const updateResult = await updatePasswordAsync({
        //   currentPassword: values.currentPassword,
        //   newPassword: values.newPassword,
        // });
        // return updateResult;

        // 現在はモックの成功処理
        console.log("Password updated successfully:", values);

        // 成功時はコンソールログのみ（実際のAPIでは通知を追加可能）
        console.log("Password change successful");

        // フォームをリセット
        passwordForm.setValues({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });

        return ok(undefined);
      } catch {
        const appError: AppError = {
          type: "NETWORK_ERROR",
          message: "パスワードの変更中にエラーが発生しました",
        };
        return err(appError);
      }
    },
  });

  // エラー再試行ハンドラ
  const handleRetry = () => {
    passwordForm.clearError();
  };

  return (
    <div className="space-y-6">
      {/* エラー表示（Result型対応） */}
      {passwordForm.error && (
        <ErrorDisplay
          error={passwordForm.error}
          onRetry={handleRetry}
          className="mb-4"
        />
      )}

      {/* パスワード変更セクション */}
      <form onSubmit={passwordForm.handleSubmit}>
        <SettingSection
          title="パスワード変更"
          icon={<Shield className="h-4 w-4 text-teal-700" />}
          description={`${user?.email || "eco_user@example.com"} アカウントのパスワード変更`}
        >
          <div className="space-y-3">
            {/* 現在のパスワード */}
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm text-stone-700"
              >
                現在のパスワード
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  className="border-stone-200 pr-10"
                  value={passwordForm.values.currentPassword}
                  onChange={passwordForm.handleChange}
                  aria-required="true"
                  aria-describedby={
                    passwordForm.fieldErrors.currentPassword
                      ? "currentPassword-error"
                      : undefined
                  }
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
              {passwordForm.fieldErrors.currentPassword && (
                <p id="currentPassword-error" className="text-xs text-red-600">
                  {passwordForm.fieldErrors.currentPassword.message}
                </p>
              )}
            </div>

            {/* 新しいパスワード */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm text-stone-700">
                新しいパスワード
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="border-stone-200 pr-10"
                  value={passwordForm.values.newPassword}
                  onChange={passwordForm.handleChange}
                  aria-required="true"
                  aria-describedby={
                    passwordForm.fieldErrors.newPassword
                      ? "newPassword-error"
                      : "newPassword-help"
                  }
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
              <p id="newPassword-help" className="text-xs text-stone-500 mt-1">
                8文字以上で、数字と記号を含めてください
              </p>
              {passwordForm.fieldErrors.newPassword && (
                <p id="newPassword-error" className="text-xs text-red-600">
                  {passwordForm.fieldErrors.newPassword.message}
                </p>
              )}
            </div>

            {/* 新しいパスワード（確認） */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmNewPassword"
                className="text-sm text-stone-700"
              >
                新しいパスワード（確認）
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="border-stone-200 pr-10"
                  value={passwordForm.values.confirmNewPassword}
                  onChange={passwordForm.handleChange}
                  aria-required="true"
                  aria-describedby={
                    passwordForm.fieldErrors.confirmNewPassword
                      ? "confirmNewPassword-error"
                      : undefined
                  }
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
              {passwordForm.fieldErrors.confirmNewPassword && (
                <p
                  id="confirmNewPassword-error"
                  className="text-xs text-red-600"
                >
                  {passwordForm.fieldErrors.confirmNewPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={passwordForm.isLoading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {passwordForm.isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                変更中...
              </div>
            ) : (
              "パスワードを変更"
            )}
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
