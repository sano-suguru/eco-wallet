import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 実際の実装では、JWTやセッションクッキーを確認
  const isAuthenticated = request.cookies.has("eco-wallet-auth");

  // 認証が必要なパスかどうかを確認
  const isAuthRequired = !request.nextUrl.pathname.startsWith("/auth/");

  // 認証が必要だが認証されていない場合はログインページにリダイレクト
  if (isAuthRequired && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 既に認証済みでログインページなどにアクセスした場合はホームにリダイレクト
  if (!isAuthRequired && isAuthenticated) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// 特定のパスに対してのみミドルウェアを適用
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
