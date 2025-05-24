import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, QrCode, Leaf, CreditCard } from "lucide-react";

interface AppFooterProps {
  activeTab?: "home" | "pay" | "eco" | "history" | "account";
}

export function AppFooter({ activeTab = "home" }: AppFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 py-2 px-4 shadow-[0_-2px_5px_rgba(0,0,0,0.08)] z-10">
      <div className="flex justify-around max-w-3xl mx-auto">
        <Link href="/" aria-label="ホーム画面に移動">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-3 h-auto relative rounded-md ${
              activeTab === "home"
                ? "text-teal-600 bg-teal-100/60"
                : "text-stone-500 hover:bg-stone-100/60"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">ホーム</span>
            {activeTab === "home" && (
              <div className="absolute -top-2 w-1/2 h-1 bg-teal-600 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/qrcode" aria-label="QRコード支払い画面に移動">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-3 h-auto relative rounded-md ${
              activeTab === "pay"
                ? "text-teal-600 bg-teal-100/60"
                : "text-stone-500 hover:bg-stone-100/60"
            }`}
          >
            <QrCode className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">支払う</span>
            {activeTab === "pay" && (
              <div className="absolute -top-2 w-1/2 h-1 bg-teal-600 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/impact" aria-label="環境への影響を確認">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-3 h-auto relative rounded-md ${
              activeTab === "eco"
                ? "text-teal-600 bg-teal-100/60"
                : "text-stone-500 hover:bg-stone-100/60"
            }`}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">環境</span>
            {activeTab === "eco" && (
              <div className="absolute -top-2 w-1/2 h-1 bg-teal-600 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/history" aria-label="取引履歴を確認">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-3 h-auto relative rounded-md ${
              activeTab === "history"
                ? "text-teal-600 bg-teal-100/60"
                : "text-stone-500 hover:bg-stone-100/60"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">取引</span>
            {activeTab === "history" && (
              <div className="absolute -top-2 w-1/2 h-1 bg-teal-600 rounded-full" />
            )}
          </Button>
        </Link>

        <Link href="/settings" aria-label="アカウント設定を開く">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-3 h-auto relative rounded-md ${
              activeTab === "account"
                ? "text-teal-600 bg-teal-100/60"
                : "text-stone-500 hover:bg-stone-100/60"
            }`}
          >
            <Avatar className="h-5 w-5 border border-stone-200">
              <AvatarFallback className="text-[10px] bg-stone-100 text-stone-500">
                山田
              </AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1 font-medium">アカウント</span>
            {activeTab === "account" && (
              <div className="absolute -top-2 w-1/2 h-1 bg-teal-600 rounded-full" />
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}
