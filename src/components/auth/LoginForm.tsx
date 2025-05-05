import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthField } from "@/components/auth/AuthField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Leaf, Mail, Lock } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useState } from "react";
import { Button } from "../ui/button";

import { isValidEmail, validatePassword } from "@/lib/utils/validation";

export function LoginForm() {
  const router = useRouter();

  const { values, errors, isLoading, error, handleChange, handleSubmit } =
    useAuthForm({
      initialValues: {
        email: "",
        password: "",
      },
      validationRules: {
        email: { required: true, email: true },
        password: { required: true, minLength: 8 },
      },
      onSubmit: async (values) => {
        // カスタムバリデーション
        if (!isValidEmail(values.email)) {
          throw new Error("有効なメールアドレスを入力してください");
        }

        const passwordValidation = validatePassword(values.password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.reason || "パスワードが無効です");
        }

        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        if (result?.ok) {
          router.push("/");
          router.refresh();
        }
      },
    });

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <AuthForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      submitLabel="ログイン"
      loadingLabel="ログイン中..."
      footer={
        <>
          <div className="text-center text-sm text-stone-600">
            アカウントをお持ちでない方は
            <Link
              href="/auth/register"
              className="text-teal-700 hover:underline ml-1"
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
            className="w-full border-stone-200"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              {/* Google SVG パス */}
            </svg>
            Googleでログイン
          </Button>

          <div className="flex items-center pt-3 mt-2">
            <Leaf className="h-4 w-4 text-teal-600 mr-2" />
            <p className="text-xs text-stone-600">
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
        error={errors.email}
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
        error={errors.password}
        icon={<Lock className="h-4 w-4" />}
        action={
          <Link
            href="/auth/forgot-password"
            className="text-xs text-teal-700 hover:underline"
          >
            パスワードをお忘れですか？
          </Link>
        }
      />

      <div className="flex items-center space-x-2 text-left">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={isLoading}
        />
        <Label htmlFor="remember" className="text-sm text-stone-700">
          ログイン状態を保持する
        </Label>
      </div>
    </AuthForm>
  );
}
