"use client";

import { useState, useMemo } from "react";
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
import { AppError } from "@/shared/types/errors";
import { ErrorDisplay } from "@/components/ui/error-display";
import { showAppErrorNotification } from "@/shared/stores/app.slice";
import { validatePasswordResult } from "@/lib/utils/validation";

interface SecurityTabProps {
  user?: Session["user"];
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type ValidationResult = {
  isOk: () => boolean;
  isErr: () => boolean;
  error?: AppError;
};

export function SecurityTab({ user }: SecurityTabProps) {
  // パスワードの表示/非表示を管理する状態
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // フォーム状態（Result型対応）
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // エラーステート管理（Result型対応）
  const [error, setError] = useState<AppError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // バリデーション結果（Result型対応）
  const newPasswordValidationResult = useMemo(() => {
    if (!passwordForm.newPassword) return validatePasswordResult("");
    return validatePasswordResult(passwordForm.newPassword);
  }, [passwordForm.newPassword]);

  // 確認パスワードのバリデーション
  const confirmPasswordValidationResult = useMemo((): ValidationResult => {
    if (!passwordForm.confirmPassword) {
      const validationError: AppError = {
        type: "REQUIRED_FIELD",
        message: "確認パスワードを入力してください",
        field: "confirmPassword",
      };
      return { isOk: () => false, isErr: () => true, error: validationError };
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      const validationError: AppError = {
        type: "PASSWORD_MISMATCH",
        message: "パスワードが一致しません",
        fields: ["password", "confirmPassword"],
      };
      return { isOk: () => false, isErr: () => true, error: validationError };
    }

    return { isOk: () => true, isErr: () => false };
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  // 全体のバリデーション状態
  const isFormValid = useMemo(() => {
    return (
      passwordForm.currentPassword.trim() !== "" &&
      newPasswordValidationResult.isOk() &&
      confirmPasswordValidationResult.isOk()
    );
  }, [
    passwordForm,
    newPasswordValidationResult,
    confirmPasswordValidationResult,
  ]);

  // エラー再試行ハンドラ（Result型対応）
  const handleRetry = () => {
    setError(null);
  };

  // フォームデータ更新ハンドラ
  const handlePasswordInputChange = (
    field: keyof PasswordForm,
    value: string,
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 入力時にエラーをクリア
    if (error) {
      setError(null);
    }
  };

  // パスワード変更処理（Result型対応）
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // 基本バリデーション
      if (!passwordForm.currentPassword) {
        const validationError: AppError = {
          type: "REQUIRED_FIELD",
          message: "現在のパスワードを入力してください",
          field: "currentPassword",
        };
        setError(validationError);
        showAppErrorNotification(validationError, "入力エラー");
        return;
      }

      if (!isFormValid) {
        const validationError: AppError = {
          type: "INVALID_FORMAT",
          message: "入力内容に不備があります。各項目を確認してください。",
          field: "password",
          expected: "有効な形式",
        };
        setError(validationError);
        showAppErrorNotification(validationError, "入力エラー");
        return;
      }

      // 新しいパスワードのバリデーション結果をチェック
      if (newPasswordValidationResult.isErr()) {
        const validationError = newPasswordValidationResult.error;
        setError(validationError);
        showAppErrorNotification(validationError, "バリデーションエラー");
        return;
      }

      // 確認パスワードのバリデーション結果をチェック
      if (
        confirmPasswordValidationResult.isErr() &&
        confirmPasswordValidationResult.error
      ) {
        const validationError = confirmPasswordValidationResult.error;
        setError(validationError);
        showAppErrorNotification(validationError, "バリデーションエラー");
        return;
      }

      // TODO: 実際のAPI呼び出し処理
      // const updateResult = await updatePasswordAsync({
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword,
      // });
      // updateResult.match(
      //   (updatedUser) => {
      //     showAppErrorNotification(
      //       { type: "success", message: "パスワードを変更しました" } as any,
      //       "変更完了"
      //     );
      //     // フォームをリセット
      //     setPasswordForm({
      //       currentPassword: "",
      //       newPassword: "",
      //       confirmPassword: "",
      //     });
      //   },
      //   (updateError) => {
      //     setError(updateError);
      //     showAppErrorNotification(updateError, "変更エラー");
      //   }
      // );

      // 現在はモックの成功処理
      setTimeout(() => {
        console.log("Password updated successfully:", passwordForm);
        // フォームをリセット
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 1000);
    } catch {
      const appError: AppError = {
        type: "NETWORK_ERROR",
        message: "パスワードの変更中にエラーが発生しました",
      };
      setError(appError);
      showAppErrorNotification(appError, "変更エラー");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* エラー表示（Result型対応） */}
      {error && (
        <ErrorDisplay error={error} onRetry={handleRetry} className="mb-4" />
      )}

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
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("currentPassword", e.target.value)
                  }
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
              {passwordForm.currentPassword.trim() === "" && (
                <p className="text-xs text-red-600">
                  現在のパスワードは必須です
                </p>
              )}
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
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("newPassword", e.target.value)
                  }
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
              {newPasswordValidationResult.isErr() && (
                <p className="text-xs text-red-600">
                  {newPasswordValidationResult.error.message}
                </p>
              )}
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
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    handlePasswordInputChange("confirmPassword", e.target.value)
                  }
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
              {confirmPasswordValidationResult.isErr() &&
                confirmPasswordValidationResult.error && (
                  <p className="text-xs text-red-600">
                    {confirmPasswordValidationResult.error.message}
                  </p>
                )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
