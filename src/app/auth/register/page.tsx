"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/features/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Leaf, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { validateRegisterForm } from "@/features/auth/utils/validation";
import { registerUser } from "@/services/api/user";
import { Result, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [referrerInfo, setReferrerInfo] = useState<{ name: string } | null>(
    null,
  );

  // 登録処理
  const handleRegisterSubmit = async (
    values: Record<string, string>,
  ): Promise<Result<void, AppError>> => {
    try {
      const result = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      return result.map(() => {
        // 登録成功時の処理
        router.push(
          `/auth/register-success?email=${encodeURIComponent(values.email)}`,
        );
      });
    } catch (error) {
      return err({
        type: "SERVER_ERROR",
        message: error instanceof Error ? error.message : "登録に失敗しました",
        statusCode: 500,
      });
    }
  };

  const {
    values,
    setValues,
    fieldErrors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    clearFieldError,
  } = useAuthForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      agreeTerms: "",
    },
    validateForm: validateRegisterForm,
    onSubmit: handleRegisterSubmit,
  });

  // URLからリファラルコードを取得
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      console.log("Referral from:", ref);
      // モック実装：リファラルコードがある場合の処理
      if (ref.startsWith("ECO")) {
        setValues((prev) => ({ ...prev, referralCode: ref }));
      } else {
        // ユーザーIDからリファラル情報を取得する処理（モック）
        setReferrerInfo({ name: "招待したユーザー" });
      }
    }
  }, [searchParams, setValues]);

  const handleCheckboxChange = (checked: boolean) => {
    const event = {
      target: {
        name: "agreeTerms",
        value: checked ? "true" : "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {referrerInfo && (
        <div className="bg-teal-50 p-3 rounded-md border border-teal-100 mb-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-teal-600 mr-2" />
            <span className="text-sm font-medium text-teal-800">
              友達からの招待
            </span>
          </div>
          <p className="text-xs text-teal-700">
            {referrerInfo.name}
            さんから招待されました。登録すると、あなたも招待した方も1,000円分のエコポイントが獲得できます！
          </p>
        </div>
      )}

      <div className="space-y-2 text-left">
        <Label htmlFor="name">お名前</Label>
        <Input
          id="name"
          name="name"
          placeholder="山田 太郎"
          value={values.name}
          onChange={handleChange}
          onFocus={() => clearFieldError("name")}
        />
        {fieldErrors.name && <ErrorDisplay error={fieldErrors.name} />}
      </div>

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

      <div className="space-y-2 text-left">
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          value={values.password}
          onChange={handleChange}
          onFocus={() => clearFieldError("password")}
        />
        <p className="text-xs text-stone-500">
          8文字以上で、英数字と記号を含めてください
        </p>
        {fieldErrors.password && <ErrorDisplay error={fieldErrors.password} />}
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="confirmPassword">パスワード（確認）</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="********"
          value={values.confirmPassword}
          onChange={handleChange}
          onFocus={() => clearFieldError("confirmPassword")}
        />
        {fieldErrors.confirmPassword && (
          <ErrorDisplay error={fieldErrors.confirmPassword} />
        )}
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="referralCode" className="text-sm">
          招待コード（任意）
        </Label>
        <Input
          id="referralCode"
          name="referralCode"
          placeholder="例：ECO1234"
          value={values.referralCode}
          onChange={handleChange}
          onFocus={() => clearFieldError("referralCode")}
          className="border-stone-200"
        />
        {fieldErrors.referralCode && (
          <ErrorDisplay error={fieldErrors.referralCode} />
        )}
      </div>

      <div className="flex items-start space-x-2 text-left">
        <Checkbox
          id="terms"
          checked={values.agreeTerms === "true"}
          onCheckedChange={handleCheckboxChange}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm text-stone-700">
          <span>
            <Link href="/terms" className="text-teal-700 hover:underline">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="text-teal-700 hover:underline">
              プライバシーポリシー
            </Link>
            に同意します
          </span>
        </Label>
      </div>
      {fieldErrors.agreeTerms && (
        <ErrorDisplay error={fieldErrors.agreeTerms} />
      )}

      {error && <ErrorDisplay error={error} />}

      <Button
        type="submit"
        className="w-full bg-teal-700 hover:bg-teal-800 text-white"
        disabled={isLoading}
      >
        {isLoading ? "登録中..." : "登録する"}
      </Button>

      <div className="text-center text-sm text-stone-600">
        アカウントをお持ちの方は
        <Link href="/auth/login" className="text-teal-700 hover:underline ml-1">
          ログイン
        </Link>
      </div>

      <div className="flex items-center pt-3 mt-2">
        <Leaf className="h-4 w-4 text-teal-600 mr-2" />
        <p className="text-xs text-stone-600">
          登録すると、毎月の環境貢献レポートを受け取れます。
        </p>
      </div>
    </form>
  );
}

// フォールバックコンポーネント（ローディング状態を表示）
function LoadingForm() {
  return <div>ロード中...</div>;
}

// メインコンポーネント
export default function RegisterPage() {
  return (
    <AuthLayout title="新規登録" subtitle="シンプルで環境に優しい決済サービス">
      <Suspense fallback={<LoadingForm />}>
        <RegisterFormContent />
      </Suspense>
    </AuthLayout>
  );
}
