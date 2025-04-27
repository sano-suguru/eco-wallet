import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* ロゴ */}
          <div className="flex flex-col items-center space-y-2">
            <svg viewBox="0 0 100 40" className="h-16 w-auto fill-teal-700">
              <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
              <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Eco Wallet
            </h1>
            {subtitle && <p className="text-sm text-stone-600">{subtitle}</p>}
          </div>

          {/* ページタイトル */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
          </div>

          {/* コンテンツ */}
          <div className="space-y-4">{children}</div>
        </div>
      </div>

      {/* フッター */}
      <div className="p-4 text-center">
        <p className="text-xs text-stone-500">
          © 2025 Eco Wallet. All rights reserved.
        </p>
      </div>
    </div>
  );
}
