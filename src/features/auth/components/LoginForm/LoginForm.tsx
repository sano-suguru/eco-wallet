import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "../AuthForm/LegacyAuthForm";
import { AuthField } from "../AuthField/LegacyAuthField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Leaf, Mail, Lock } from "lucide-react";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { validateLoginForm } from "@/features/auth/utils/validation";
import { loginUser } from "@/services/api/user";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Result, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";

export function LoginForm() {
  const router = useRouter();

  // ログイン処理
  const handleLoginSubmit = async (
    values: Record<string, string>,
  ): Promise<Result<void, AppError>> => {
    try {
      const result = await loginUser({
        email: values.email,
        password: values.password,
      });

      return result.map(() => {
        // 成功時の処理
        router.push("/");
        router.refresh();
      });
    } catch (error) {
      return err({
        type: "SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "ログインに失敗しました",
        statusCode: 500,
      });
    }
  };

  const { values, fieldErrors, isLoading, error, handleChange, handleSubmit } =
    useAuthForm({
      initialValues: {
        email: "",
        password: "",
      },
      validateForm: validateLoginForm,
      onSubmit: handleLoginSubmit,
    });

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <AuthForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error?.message}
      submitLabel="ログイン"
      loadingLabel="ログイン中..."
      footer={
        <>
          <div className="text-center text-sm text-stone-600">
            アカウントをお持ちでない方は
            <Link
              href="/auth/register"
              className="text-teal-700 hover:underline ml-1 font-medium"
            >
              新規登録
            </Link>
          </div>

          <div className="flex items-center py-2">
            <div className="flex-grow h-px bg-stone-200"></div>
            <span className="px-2 text-xs text-stone-500">または</span>
            <div className="flex-grow h-px bg-stone-200"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-stone-300 h-10 px-4 py-2 hover:bg-stone-50 transition-all shadow-xs"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Googleでログイン
          </Button>

          <div className="flex items-center pt-3 mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md">
            <Leaf className="h-5 w-5 text-teal-700 mr-2.5 flex-shrink-0" />
            <p className="text-xs text-teal-800">
              環境に優しいサーバーで運用され、取引ごとに環境保護活動に寄付が行われます。
            </p>
          </div>
        </>
      }
    >
      <AuthField
        id="email"
        name="email"
        label="メールアドレス"
        type="email"
        placeholder="your@email.com"
        value={values.email}
        onChange={handleChange}
        disabled={isLoading}
        required
        error={fieldErrors.email?.message}
        icon={<Mail className="h-4 w-4" />}
      />

      <AuthField
        id="password"
        name="password"
        label="パスワード"
        type="password"
        placeholder="********"
        value={values.password}
        onChange={handleChange}
        disabled={isLoading}
        required
        error={fieldErrors.password?.message}
        icon={<Lock className="h-4 w-4" />}
        action={
          <Link
            href="/auth/forgot-password"
            className="text-xs text-teal-700 hover:underline hover:text-teal-800 font-medium"
          >
            パスワードをお忘れですか？
          </Link>
        }
      />

      <div className="flex items-center space-x-2 text-left mt-1">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={isLoading}
          className="text-teal-700 border-stone-400 data-[state=checked]:bg-teal-700"
        />
        <Label
          htmlFor="remember"
          className="text-sm text-stone-700 cursor-pointer"
        >
          ログイン状態を保持する
        </Label>
      </div>
    </AuthForm>
  );
}
