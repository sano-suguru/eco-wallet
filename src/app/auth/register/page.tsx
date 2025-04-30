"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, Users } from "lucide-react";
import { useRouter } from "next/navigation";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [referrerInfo, setReferrerInfo] = useState<{ name: string } | null>(
    null,
  );

  // URLからリファラルコードを取得
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // 実際の実装ではAPIを呼び出して参照者情報を取得
      console.log("Referral from:", ref);

      // モック実装：リファラルコードがある場合の処理
      if (ref.startsWith("ECO")) {
        setReferralCode(ref);
      } else {
        // ユーザーIDからリファラル情報を取得する処理（モック）
        setReferrerInfo({ name: "招待したユーザー" });
      }
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 実際の実装では、認証APIを呼び出す
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 簡易的なバリデーション
      if (!name || !email || !password) {
        throw new Error("すべての項目を入力してください");
      }

      if (password !== confirmPassword) {
        throw new Error("パスワードが一致しません");
      }

      if (!agreeTerms) {
        throw new Error("利用規約とプライバシーポリシーに同意してください");
      }

      // 招待コードの処理（実際の実装ではAPIで検証）
      if (referralCode) {
        console.log("Referral code used:", referralCode);
        // 招待コードの検証と処理
      }

      // 登録成功したとみなす
      router.push(`/auth/register-success?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
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
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-stone-500">
          8文字以上で、英数字と記号を含めてください
        </p>
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="confirmPassword">パスワード（確認）</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="referralCode" className="text-sm">
          招待コード（任意）
        </Label>
        <Input
          id="referralCode"
          placeholder="例：ECO1234"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="border-stone-200"
        />
        {referralCode && !referralCode.startsWith("ECO") && (
          <p className="text-xs text-amber-600">
            招待コードはECOから始まる英数字です
          </p>
        )}
      </div>

      <div className="flex items-start space-x-2 text-left">
        <Checkbox
          id="terms"
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
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
