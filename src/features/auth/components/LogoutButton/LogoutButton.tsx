"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogoutButtonProps } from "../../types/auth";

/**
 * ログアウトボタンコンポーネント
 *
 * ログアウト機能を提供するボタン。表示スタイルはプロパティで調整可能
 */
export function LogoutButton({
  label = "ログアウト",
  showIcon = true,
  variant = "ghost",
  className = "text-stone-600",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {isLoading ? "ログアウト中..." : label}
    </Button>
  );
}
