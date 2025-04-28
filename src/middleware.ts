import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // NextAuthのトークンを取得
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // 公開パス（認証不要なパス）
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/splash",
  ];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );
  const isAuthPath = request.nextUrl.pathname.startsWith("/auth/");

  // 認証済みユーザーが認証ページにアクセスした場合はホームにリダイレクト
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 未認証ユーザーが保護されたページにアクセスした場合はログインにリダイレクト
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// 特定のパスに対してのみミドルウェアを適用
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
