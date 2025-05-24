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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User, Bell, CreditCard, Shield, Leaf } from "lucide-react";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <PageHeader />

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
