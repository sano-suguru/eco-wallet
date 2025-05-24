"use client";

import { AuthLayout } from "@/features/layout";
import { LoginForm } from "@/features/auth";
import { Gift } from "lucide-react";

export default function LoginPage() {
  return (
    <AuthLayout title="ログイン" subtitle="シンプルで環境に優しい決済サービス">
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
        <div className="flex items-center mb-3">
          <Gift className="h-5 w-5 text-amber-700 mr-2" />
          <h3 className="text-sm font-medium text-amber-800">
            テストアカウント
          </h3>
        </div>
        <div className="space-y-2 text-sm text-amber-700 pl-7">
          <div className="grid grid-cols-[100px_1fr] gap-1">
            <span className="text-amber-800 font-medium">メールアドレス:</span>
            <span>demo@example.com</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-1">
            <span className="text-amber-800 font-medium">パスワード:</span>
            <span>P@ssw0rd</span>
          </div>
        </div>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}
