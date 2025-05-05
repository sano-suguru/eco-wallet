import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QrCode, Leaf, CreditCard } from "lucide-react";

interface AppFooterProps {
  activeTab?: "home" | "pay" | "eco" | "history" | "account";
}

export function AppFooter({ activeTab = "home" }: AppFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 py-2 px-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-10">
      <div className="flex justify-around max-w-3xl mx-auto">
        <Link href="/" aria-label="ホーム画面に移動">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-1 h-auto relative ${
              activeTab === "home" ? "text-teal-700" : "text-stone-500"
            }`}
          >
            <svg
              viewBox="0 0 100 40"
              className={`h-6 w-auto ${
                activeTab === "home" ? "fill-teal-700" : "fill-stone-500"
              }`}
            >
              <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
              <path
                d="M45,15 L55,15 L55,25 L45,25 L45,15z"
                fill={activeTab === "home" ? "white" : "stone-300"}
              />
            </svg>
            <span className="text-xs mt-1 font-medium">ホーム</span>
            {activeTab === "home" && (
              <div className="absolute -top-2 w-1/2 h-0.5 bg-teal-700 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/qrcode" aria-label="QRコード支払い画面に移動">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-1 h-auto relative ${
              activeTab === "pay" ? "text-teal-700" : "text-stone-500"
            }`}
          >
            <QrCode className="h-5 w-5" />
            <span className="text-xs mt-1">支払う</span>
            {activeTab === "pay" && (
              <div className="absolute -top-2 w-1/2 h-0.5 bg-teal-700 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/impact" aria-label="環境への影響を確認">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-1 h-auto relative ${
              activeTab === "eco" ? "text-teal-700" : "text-stone-500"
            }`}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-xs mt-1">環境</span>
            {activeTab === "eco" && (
              <div className="absolute -top-2 w-1/2 h-0.5 bg-teal-700 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/history" aria-label="取引履歴を確認">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-1 h-auto relative ${
              activeTab === "history" ? "text-teal-700" : "text-stone-500"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs mt-1">取引</span>
            {activeTab === "history" && (
              <div className="absolute -top-2 w-1/2 h-0.5 bg-teal-700 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/settings" aria-label="アカウント設定を開く">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-1 h-auto relative ${
              activeTab === "account" ? "text-teal-700" : "text-stone-500"
            }`}
          >
            <Avatar className="h-5 w-5 border border-stone-200">
              <AvatarFallback className="text-[10px]">山田</AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1">アカウント</span>
            {activeTab === "account" && (
              <div className="absolute -top-2 w-1/2 h-0.5 bg-teal-700 rounded-full" />
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}
