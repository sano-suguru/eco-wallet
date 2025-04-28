import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userBalanceData } from "../mock-data/user-profile";

export interface AuthState {
  isAuthenticated: boolean;
  user: typeof userBalanceData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email, password) => {
        // 実際の実装ではAPIを呼び出す
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 簡易的なバリデーション（実際の実装では不要）
        if (email !== "demo@example.com" || password !== "password123") {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        set({
          isAuthenticated: true,
          user: userBalanceData,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      register: async (name, email) => {
        // 実際の実装ではAPIを呼び出す
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 登録成功としてユーザー情報をセット（実際の実装では、APIからのレスポンスを使用）
        set({
          isAuthenticated: true,
          user: {
            ...userBalanceData,
            name,
            email,
          },
        });
      },
    }),
    {
      name: "eco-wallet-auth", // localStorage のキー
    },
  ),
);
