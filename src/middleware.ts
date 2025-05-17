import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getRouteType, authRedirects } from "@/lib/auth-config";

export async function middleware(request: NextRequest) {
  // NextAuthのトークンを取得
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // パスのタイプを判定
  const path = request.nextUrl.pathname;
  const routeType = getRouteType(path);

  // 認証ロジックの適用
  if (isAuthenticated && routeType === "auth") {
    // 認証済みユーザーが認証ページにアクセスした場合はホームにリダイレクト
    return NextResponse.redirect(
      new URL(authRedirects.authenticatedVisitingAuthPage, request.url),
    );
  }

  if (!isAuthenticated && routeType === "protected") {
    // 未認証ユーザーが保護されたページにアクセスした場合はログインにリダイレクト
    return NextResponse.redirect(
      new URL(authRedirects.unauthenticatedVisitingProtectedPage, request.url),
    );
  }

  return NextResponse.next();
}

// 特定のパスに対してのみミドルウェアを適用（静的アセットは除外）
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
