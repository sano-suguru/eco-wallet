import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userBalanceData } from "./mock-data/user-profile";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日間
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

        // デモ用の認証ロジック
        if (
          (credentials.email === "demo@example.com" ||
            credentials.email === "eco_user@example.com") &&
          credentials.password === "password123"
        ) {
          // 認証成功時はユーザー情報を返す
          return {
            id: userBalanceData.id,
            name: userBalanceData.name,
            email: credentials.email,
            image: userBalanceData.avatarUrl,
            // カスタムデータ
            balance: userBalanceData.balance,
            ecoRank: userBalanceData.ecoRank,
          };
        }

        // 認証失敗
        return null;
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
