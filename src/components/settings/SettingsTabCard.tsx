"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Leaf, Bell, Lock, CreditCard } from "lucide-react";
import {
  ProfileTab,
  EcoTab,
  NotificationsTab,
  PaymentTab,
  SecurityTab,
} from "@/features/settings";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SettingsTabCardProps {
  user?: Session["user"];
}

export function SettingsTabCard({ user }: SettingsTabCardProps) {
  // URLのクエリパラメータからタブを取得
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  // URLにtabパラメータがある場合、そのタブを表示
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["profile", "eco", "notifications", "payment", "security"].includes(
        tabParam,
      )
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <Card className="sm:w-2/3 border-0 shadow-md bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-stone-900">アカウント設定</CardTitle>
        <CardDescription>個人情報や環境設定を管理します</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 bg-stone-100 rounded-none border-b border-stone-200">
            <TabsTrigger
              value="profile"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              <User className="h-3 w-3 mr-1" />
              プロフィール
            </TabsTrigger>
            <TabsTrigger
              value="eco"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              <Leaf className="h-3 w-3 mr-1" />
              環境設定
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              <Bell className="h-3 w-3 mr-1" />
              通知
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              <CreditCard className="h-3 w-3 mr-1" />
              支払い
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              <Lock className="h-3 w-3 mr-1" />
              セキュリティ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-6">
            <ProfileTab user={user} />
          </TabsContent>

          <TabsContent value="eco" className="p-6">
            <EcoTab user={user} />
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            <NotificationsTab user={user} />
          </TabsContent>

          <TabsContent value="payment" className="p-6">
            <PaymentTab user={user} />
          </TabsContent>

          <TabsContent value="security" className="p-6">
            <SecurityTab user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
