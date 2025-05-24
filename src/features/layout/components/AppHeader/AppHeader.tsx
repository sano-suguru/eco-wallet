"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { useSession } from "next-auth/react";

interface AppHeaderProps {
  title?: string;
  showAvatar?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
}

export function AppHeader({
  title = "Eco Wallet",
  showAvatar = true,
  showSettings = true,
  showNotifications = true,
}: AppHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="sticky top-0 p-4 bg-teal-700 text-white shadow-sm z-10">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        <div className="flex items-center space-x-2">
          <Link href="/" aria-label="ホームに戻る">
            <svg viewBox="0 0 100 40" className="h-8 w-auto fill-white">
              <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
              <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="teal" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold">{title}</h1>
        </div>

        <div className="flex items-center space-x-3">
          {showNotifications && (
            <Link href="/notifications" aria-label="通知を確認">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-teal-600 h-8 w-8 rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {showSettings && (
            <Link href="/settings" aria-label="設定を開く">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-teal-600 h-8 w-8 rounded-full"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {showAvatar && user && (
            <Link href="/settings" aria-label="アカウント設定を開く">
              <Avatar className="h-8 w-8 border border-white/30 hover:border-white transition-colors">
                <AvatarImage
                  src={user.image || "/api/placeholder/32/32"}
                  alt={user.name || "ユーザー"}
                />
                <AvatarFallback className="bg-teal-600 text-white">
                  {user.name ? user.name.slice(0, 2) : "ユ"}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
