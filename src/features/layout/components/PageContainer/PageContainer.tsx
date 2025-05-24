import { ReactNode } from "react";
import { AppHeader } from "@/features/layout/components/AppHeader";
import { AppFooter } from "@/features/layout/components/AppFooter";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  activeTab?: "home" | "pay" | "eco" | "history" | "account";
  showHeader?: boolean;
  showFooter?: boolean;
  showAvatar?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
}

export function PageContainer({
  children,
  title = "Eco Wallet",
  activeTab = "home",
  showHeader = true,
  showFooter = true,
  showAvatar = true,
  showSettings = true,
  showNotifications = true,
}: PageContainerProps) {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col">
      {showHeader && (
        <AppHeader
          title={title}
          showAvatar={showAvatar}
          showSettings={showSettings}
          showNotifications={showNotifications}
        />
      )}

      <div className="flex-1 p-4 space-y-6 max-w-3xl mx-auto w-full pb-20">
        {children}
      </div>

      {showFooter && <AppFooter activeTab={activeTab} />}
    </div>
  );
}
