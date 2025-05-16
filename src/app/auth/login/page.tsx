"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Gift } from "lucide-react";

export default function LoginPage() {
  return (
    <AuthLayout title="ログイン" subtitle="シンプルで環境に優しい決済サービス">
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center mb-2">
          <Gift className="h-4 w-4 text-amber-700 mr-2" />
          <h3 className="text-sm font-medium text-amber-800">
            テストアカウント
          </h3>
        </div>
        <div className="space-y-1 text-sm text-amber-700 pl-6">
          <p>メールアドレス: demo@example.com</p>
          <p>パスワード: P@ssw0rd</p>
        </div>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}
