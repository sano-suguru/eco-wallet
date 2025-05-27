"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/features/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorDisplay } from "@/components/ui/error-display";
import { CheckCircle } from "lucide-react";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { validateForgotPasswordForm } from "@/features/auth/utils/validation";
import { requestPasswordReset } from "@/services/api/user";
import { Result, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // パスワードリセット処理
  const handlePasswordResetSubmit = async (
    values: Record<string, string>,
  ): Promise<Result<void, AppError>> => {
    try {
      const result = await requestPasswordReset(values.email);

      return result.map(() => {
        // 成功時の処理
        setSubmittedEmail(values.email);
        setIsSubmitted(true);
      });
    } catch (error) {
      return err({
        type: "SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "リクエストに失敗しました",
        statusCode: 500,
      });
    }
  };

  const {
    values,
    fieldErrors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    clearFieldError,
  } = useAuthForm({
    initialValues: {
      email: "",
    },
    validateForm: validateForgotPasswordForm,
    onSubmit: handlePasswordResetSubmit,
  });

  return (
    <AuthLayout
      title="パスワードをリセット"
      subtitle="シンプルで環境に優しい決済サービス"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-stone-600 text-left">
            アカウントに登録されているメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
          </p>

          <div className="space-y-2 text-left">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              onFocus={() => clearFieldError("email")}
            />
            {fieldErrors.email && <ErrorDisplay error={fieldErrors.email} />}
          </div>

          {error && <ErrorDisplay error={error} />}

          <Button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? "リクエスト中..." : "リセットリンクを送信"}
          </Button>

          <div className="text-center text-sm text-stone-600">
            <Link href="/auth/login" className="text-teal-700 hover:underline">
              ログイン画面に戻る
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-teal-700" />
            </div>
            <h3 className="text-lg font-medium text-stone-800">
              メールを送信しました
            </h3>
            <p className="text-sm text-stone-600 mt-2">
              {submittedEmail}{" "}
              宛にパスワードリセットリンクを送信しました。メールをご確認ください。
            </p>
          </div>

          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="w-full border-stone-200"
          >
            メールアドレスを変更する
          </Button>

          <div className="text-center text-sm text-stone-600">
            <Link href="/auth/login" className="text-teal-700 hover:underline">
              ログイン画面に戻る
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
