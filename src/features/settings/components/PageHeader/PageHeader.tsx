"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

/**
 * 設定ページのヘッダーコンポーネント
 */
export function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Link href="/">
          <svg viewBox="0 0 100 40" className="h-8 w-auto fill-teal-700">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          Eco Wallet
        </h1>
      </div>
      <LogoutButton />
    </div>
  );
}
