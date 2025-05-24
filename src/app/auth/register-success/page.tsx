"use client";

import Link from "next/link";
import { Suspense } from "react"; // Suspenseをインポート
import { AuthLayout } from "@/features/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Leaf, Mail, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

function RegisterSuccessContent() {
  // クエリパラメータからメールアドレスを取得（セキュリティのため短時間しか保持しない）
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "登録したメールアドレス";

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center border-2 border-teal-100">
        <CheckCircle className="h-10 w-10 text-teal-700" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-stone-800">
          アカウント登録が完了しました
        </h2>
        <p className="text-sm text-stone-600">
          {email} 宛に確認メールを送信しました。
          <br />
          メールに記載されたリンクをクリックして、アカウントを有効化してください。
        </p>
      </div>

      <Card className="border-0 shadow-md bg-stone-50 p-4 w-full">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-stone-600 mt-0.5" />
          <div className="text-sm text-stone-600">
            <p className="font-medium">確認メールが届かない場合：</p>
            <ul className="list-disc list-inside mt-1 text-xs space-y-1">
              <li>迷惑メールフォルダをご確認ください</li>
              <li>
                数分経っても届かない場合は、再度登録を試みるか、サポートまでお問い合わせください
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="bg-teal-50 border border-teal-100 rounded-md p-4 w-full">
        <div className="flex items-start space-x-3">
          <Leaf className="h-5 w-5 text-teal-700 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-teal-800">
              環境貢献の第一歩
            </p>
            <p className="text-xs text-teal-700 mt-1">
              Eco
              Walletへの登録により、ペーパーレス決済を通じて年間約500gの紙資源を節約できます。あなたの環境貢献活動はすでに始まっています。
            </p>
          </div>
        </div>
      </div>

      <Link href="/auth/login" className="w-full">
        <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
          ログイン画面へ
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>

      <div className="text-center text-xs text-stone-500 mt-4">
        お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
      </div>
    </div>
  );
}

// フォールバックコンポーネント（ローディング状態を表示）
function RegisterSuccessLoading() {
  return <div>ロード中...</div>;
}

export default function RegisterSuccessPage() {
  return (
    <AuthLayout title="登録完了" subtitle="シンプルで環境に優しい決済サービス">
      <Suspense fallback={<RegisterSuccessLoading />}>
        <RegisterSuccessContent />
      </Suspense>
    </AuthLayout>
  );
}
