/**
 * 認証機能の公開API
 */

// 型定義のエクスポート
export * from "./types/auth";

// コンポーネントのエクスポート
export { AuthField } from "./components/AuthField";
export type { ExtendedAuthFieldProps } from "./components/AuthField";
export { AuthForm } from "./components/AuthForm";
export { LogoutButton } from "./components/LogoutButton";

// フックのエクスポート（将来追加予定）
// export { useAuth } from "./hooks/useAuth";
// export { useAuthForm } from "./hooks/useAuthForm";

// ユーティリティのエクスポート（将来追加予定）
// export { validateEmail } from "./utils/validators";
// export { getAuthRedirectPath } from "./utils/auth-redirects";

// ストアのエクスポート（将来追加予定）
// export { useAuthStore } from "./store/auth.slice";
// export type { AuthState } from "./store/auth.slice";
