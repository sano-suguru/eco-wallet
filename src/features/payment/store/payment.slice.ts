import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PaymentStore, PaymentStatus } from "../types/payment";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";

const initialState = {
  paymentInfo: null,
  paymentStatus: "idle" as PaymentStatus,
  error: null,
};

export const usePaymentStore = create<PaymentStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setPaymentInfo: (info) => set({ paymentInfo: info, error: null }),

      setPaymentMethod: (method) =>
        set((state) => ({
          paymentInfo: state.paymentInfo
            ? { ...state.paymentInfo, selectedPaymentMethod: method }
            : null,
        })),

      setPaymentOptions: (options) =>
        set((state) => {
          if (!state.paymentInfo) return state;

          const updatedOptions = { ...state.paymentInfo.options, ...options };
          const donationAmount = updatedOptions.includeDonation
            ? updatedOptions.donationAmount
            : 0;
          const total = state.paymentInfo.subtotal + donationAmount;

          return {
            paymentInfo: {
              ...state.paymentInfo,
              options: updatedOptions,
              donationAmount,
              total,
            },
          };
        }),

      processPayment: async () => {
        const state = get();
        if (!state.paymentInfo) {
          return { success: false, error: "Payment info not set" };
        }

        set({ paymentStatus: "processing", error: null });

        try {
          // 決済処理のモック - 実際のAPIコールの代わりにタイマーを使用
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // トランザクションストアから関数を取得
          const addTransaction = useTransactionStore.getState().addTransaction;

          // 新しいトランザクションを作成
          const newTransaction = {
            type: "payment" as const,
            description: state.paymentInfo.product.name,
            date: new Date()
              .toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\//g, "/"),
            amount: -state.paymentInfo.total,
            ecoContribution: state.paymentInfo.options.includeDonation
              ? {
                  enabled: true,
                  amount: state.paymentInfo.donationAmount,
                }
              : undefined,
            badges: state.paymentInfo.product.isEcoFriendly ? ["環境貢献"] : [],
          };

          // トランザクションをストアに追加して、生成されたIDを取得
          const transactionId = addTransaction(newTransaction);

          set({ paymentStatus: "success" });

          return { success: true, transactionId };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "決済処理中にエラーが発生しました";
          set({ paymentStatus: "error", error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      resetPayment: () => set(initialState),
    }),
    {
      name: "payment-store",
    },
  ),
);
