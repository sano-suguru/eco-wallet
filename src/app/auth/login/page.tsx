"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="ログイン" subtitle="シンプルで環境に優しい決済サービス">
      <LoginForm />
    </AuthLayout>
  );
}
