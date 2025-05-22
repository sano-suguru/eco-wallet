"use client";
import { Button } from "@/components/ui/button";
import { AuthFormProps } from "../../types/auth";

/**
 * 認証フォームコンポーネント
 *
 * ログイン、登録などの共通フォームレイアウトとスタイリングを提供する
 */
export function AuthForm({
  title,
  subtitle,
  children,
  onSubmit,
  submitText,
  isSubmitting,
  error,
  footerLink,
}: AuthFormProps) {
  return (
    <div className="space-y-6 p-1">
      {/* ヘッダー */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-stone-800">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
      </div>

      {/* フォーム */}
      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        {/* エラーメッセージ */}
        {error && (
          <div className="text-sm bg-red-50 p-3 rounded-md border border-red-100 text-red-600">
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <Button
          type="submit"
          className="w-full bg-teal-700 hover:bg-teal-800 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
              処理中...
            </>
          ) : (
            submitText
          )}
        </Button>

        {/* フッターリンク */}
        {footerLink && (
          <div className="text-center text-sm text-stone-500 mt-4">
            {footerLink}
          </div>
        )}
      </form>
    </div>
  );
}
