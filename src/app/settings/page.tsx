import { PageHeader } from "@/components/settings/PageHeader";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { SettingsTabCard } from "@/components/settings/SettingsTabCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <PageHeader />

        <div className="flex flex-col sm:flex-row gap-6">
          <ProfileCard user={user} />
          <SettingsTabCard user={user} />
        </div>

        <p className="text-xs text-center text-stone-500 mt-6">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
