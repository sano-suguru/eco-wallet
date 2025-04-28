"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
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
      // Next-Authのサインイン関数を呼び出す
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
        return;
      }

      if (result?.ok) {
        // ログイン成功時、ホームページへリダイレクト
        router.push("/");
        router.refresh(); // セッション状態を反映するためにリフレッシュ
      }
    } catch {
      setError("認証中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="ログイン" subtitle="シンプルで環境に優しい決済サービス">
      <form onSubmit={handleLogin} className="space-y-4">
        {/* 既存のフォーム要素はそのまま */}
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

        {/* 他のログインオプションと情報はそのまま */}
        <div className="text-center text-sm text-stone-600">
          アカウントをお持ちでない方は
          <Link
            href="/auth/register"
            className="text-teal-700 hover:underline ml-1"
          >
            新規登録
          </Link>
        </div>

        {/* 既存のその他の要素... */}
      </form>
    </AuthLayout>
  );
}
