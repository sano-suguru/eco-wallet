import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userBalanceData } from "./mock-data/user-profile";
import crypto from "crypto";

// 本番環境では安全なシークレットを使用する必要があります
const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "unsafe_development_secret";

// パスワードのハッシュ化関数（実際のAPIがない場合のモック用）
const hashPassword = (password: string) => {
  return crypto
    .createHash("sha256")
    .update(`${password}${NEXTAUTH_SECRET}`)
    .digest("hex");
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  secret: NEXTAUTH_SECRET,
  // CSRFトークンを付与して保護
  useSecureCookies: process.env.NODE_ENV === "production",
  // 本番環境でのみHTTPSを強制
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`, // 開発用
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // ページのカスタマイズ
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 本番環境ではここでAPIを呼び出してユーザー認証を行う
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // メールアドレスの適切な検証
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(credentials.email)) {
          return null;
        }

        // デモ用の認証ロジック（パスワードのハッシュ化を模擬）
        const demoUsers = [
          {
            id: userBalanceData.id,
            name: userBalanceData.name,
            email: "demo@example.com", // オーバーライド
            avatarUrl: userBalanceData.avatarUrl,
            balance: userBalanceData.balance,
            ecoRank: userBalanceData.ecoRank,
            passwordHash: hashPassword("password123"),
          },
          {
            // eco_user@example.comはuserBalanceDataと一致するのでスプレッド使用
            ...userBalanceData,
            passwordHash: hashPassword("password123"),
          },
        ];

        const user = demoUsers.find((u) => u.email === credentials.email);
        if (!user) return null;

        // パスワードの検証（ハッシュ値の比較）
        const isValid =
          hashPassword(credentials.password) === user.passwordHash;
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          balance: user.balance,
          ecoRank: user.ecoRank,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.balance = user.balance;
        token.ecoRank = user.ecoRank;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.balance = token.balance;
        session.user.ecoRank = token.ecoRank;
      }
      return session;
    },
  },
};
