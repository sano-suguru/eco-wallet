"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 実際の実装では、パスワードリセットAPIを呼び出す
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 簡易的なバリデーション
      if (!email) {
        throw new Error("メールアドレスを入力してください");
      }

      // 成功したとみなす
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "リクエストに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

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
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              {email}{" "}
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
