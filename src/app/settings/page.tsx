"use client";

import { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import {
  PageHeader,
  ProfileCard,
  ProfileTab,
  NotificationsTab,
  PaymentTab,
  SecurityTab,
  EcoTab,
} from "@/features/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { User, Bell, CreditCard, Shield, Leaf } from "lucide-react";
import { AppError } from "@/shared/types/errors";
import { ErrorDisplay } from "@/components/ui/error-display";
import { showAppErrorNotification } from "@/shared/stores/app.slice";

export default function AccountSettingsPage() {
  // セッション管理（Client Component対応）
  const { data: session, status } = useSession();

  // エラーステート管理（Result型対応）
  const [error, setError] = useState<AppError | null>(null);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // エラー再試行ハンドラ（Result型対応）
  const handleRetry = () => {
    setError(null);
    // セッションを再取得
    handleRefreshSession();
  };

  // セッション再取得ハンドラ（Result型対応）
  const handleRefreshSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const refreshedSession = await getSession();
      if (!refreshedSession) {
        const authError: AppError = {
          type: "UNAUTHORIZED",
          message: "セッションの取得に失敗しました。再ログインしてください。",
        };
        setError(authError);
        showAppErrorNotification(authError, "認証エラー");
      }
    } catch {
      const appError: AppError = {
        type: "NETWORK_ERROR",
        message: "セッションの更新中にエラーが発生しました",
      };
      setError(appError);
      showAppErrorNotification(appError, "セッションエラー");
    } finally {
      setIsLoading(false);
    }
  };

  // ローディング中の表示
  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-stone-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto mb-4"></div>
            <p className="text-stone-600">設定を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 認証エラーの表示
  if (status === "unauthenticated") {
    const authError: AppError = {
      type: "UNAUTHORIZED",
      message: "設定ページにアクセスするにはログインが必要です",
    };

    return (
      <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <ErrorDisplay
            error={authError}
            onRetry={() => (window.location.href = "/auth/login")}
            retryLabel="ログインページへ"
            className="bg-white rounded-xl shadow-sm border border-stone-100"
          />
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <PageHeader />

        {/* エラー表示（Result型対応） */}
        {error && (
          <ErrorDisplay error={error} onRetry={handleRetry} className="mb-4" />
        )}

        <div className="flex flex-col sm:flex-row gap-6">
          <ProfileCard user={user} />

          <Card className="flex-1 p-4">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-stone-100">
                <TabsTrigger value="profile" className="text-xs sm:text-sm">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">プロフィール</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="text-xs sm:text-sm"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">通知</span>
                </TabsTrigger>
                <TabsTrigger value="payment" className="text-xs sm:text-sm">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">支払い</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">セキュリティ</span>
                </TabsTrigger>
                <TabsTrigger value="eco" className="text-xs sm:text-sm">
                  <Leaf className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">エコ設定</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4">
                <ProfileTab user={user} />
              </TabsContent>
              <TabsContent value="notifications" className="mt-4">
                <NotificationsTab />
              </TabsContent>
              <TabsContent value="payment" className="mt-4">
                <PaymentTab />
              </TabsContent>
              <TabsContent value="security" className="mt-4">
                <SecurityTab />
              </TabsContent>
              <TabsContent value="eco" className="mt-4">
                <EcoTab />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <p className="text-xs text-center text-stone-500 mt-6">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
