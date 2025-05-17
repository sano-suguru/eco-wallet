/**
 * 認証関連の設定を管理するファイル
 * - 認証タイプ別のルート設定
 * - パスタイプ判定ロジック
 * - リダイレクト設定
 */

export type RouteConfig = {
  type: "public" | "auth" | "protected";
  pattern: RegExp;
};

// パスタイプ別の設定
export const routes: RouteConfig[] = [
  // 公開パス（認証不要）
  { type: "public", pattern: /^\/splash\/?$/ },
  { type: "public", pattern: /^\/api\/?.*$/ },

  // 認証用パス
  { type: "auth", pattern: /^\/auth\/login\/?$/ },
  { type: "auth", pattern: /^\/auth\/register\/?$/ },
  { type: "auth", pattern: /^\/auth\/register-success\/?$/ },
  { type: "auth", pattern: /^\/auth\/forgot-password\/?$/ },

  // その他すべては保護されたパス（優先度が最も低い）
  { type: "protected", pattern: /.*/ },
];

/**
 * 指定されたパスのルートタイプを判定する
 * @param path - 判定するパス
 * @returns 'public' | 'auth' | 'protected'
 */
export function getRouteType(path: string): "public" | "auth" | "protected" {
  // 優先順位の高い順に判定
  for (const route of routes) {
    if (route.pattern.test(path)) {
      return route.type;
    }
  }

  // デフォルトでは保護されたパスと判断
  return "protected";
}

// リダイレクト設定
export const authRedirects = {
  // 認証済みユーザーが認証ページにアクセスした場合のリダイレクト先
  authenticatedVisitingAuthPage: "/",

  // 未認証ユーザーが保護ページにアクセスした場合のリダイレクト先
  unauthenticatedVisitingProtectedPage: "/auth/login",
};
