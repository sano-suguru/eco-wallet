// 設定機能の公開API

// 型定義のエクスポート
export * from "./types/settings";

// コンポーネントのエクスポート
export { PageHeader } from "./components/PageHeader";
export { SettingSection } from "./components/SettingSection";
export type { SettingSectionProps } from "./components/SettingSection";
export { ProfileCard } from "./components/ProfileCard";
export type { ProfileCardProps } from "./components/ProfileCard";

// タブコンポーネントのエクスポート
export {
  EcoTab,
  ProfileTab,
  NotificationsTab,
  PaymentTab,
  SecurityTab,
} from "./components/tabs";

// ユーティリティ関数のエクスポート（将来追加予定）
// export { validateEmail, formatPhoneNumber } from "./utils/validation";

// ストアのエクスポート（将来追加予定）
// export { useSettingsStore } from "./store/settings.slice";
// export type { SettingsSlice } from "./store/settings.slice";
