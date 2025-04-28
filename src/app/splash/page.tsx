"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Leaf } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // スプラッシュ画面を表示して少し待ってから適切な画面にリダイレクト
    const timer = setTimeout(() => {
      if (status === "authenticated") {
        router.push("/");
      } else {
        router.push("/auth/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <div className="min-h-screen bg-teal-800 flex flex-col items-center justify-center">
      <div className="animate-pulse">
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 100 40" className="h-24 w-auto fill-white mb-4">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="teal" />
          </svg>
          <h1 className="text-3xl font-bold text-white">Eco Wallet</h1>
          <p className="text-sm text-teal-100 mt-2">
            シンプルで環境に優しい決済サービス
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center text-teal-100 text-sm">
        <Leaf className="h-4 w-4 mr-2" />
        <span>環境と共に、持続可能な未来へ</span>
      </div>
    </div>
  );
}
