"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 認証ストアのログイン関数を呼び出す
      await login(email, password);

      // ログイン成功時、ホームページへリダイレクト
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "認証に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="ログイン" subtitle="シンプルで環境に優しい決済サービス">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <Label htmlFor="password">パスワード</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-teal-700 hover:underline"
            >
              パスワードをお忘れですか？
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2 text-left">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm text-stone-700">
            ログイン状態を保持する
          </Label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>

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

        <div className="flex items-center pt-3 mt-2">
          <Leaf className="h-4 w-4 text-teal-600 mr-2" />
          <p className="text-xs text-stone-600">
            環境に優しいサーバーで運用され、取引ごとに環境保護活動に寄付が行われます。
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
