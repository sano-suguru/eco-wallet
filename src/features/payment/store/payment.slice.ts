import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PaymentStore, PaymentStatus } from "../types/payment";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";
import { processPayment as businessProcessPayment } from "@/lib/business/payment";
import { getErrorMessage } from "@/lib/utils/error-utils";

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

        // paymentInfoを変数に保存してnullチェック問題を回避
        const paymentInfo = state.paymentInfo;

        set({ paymentStatus: "processing", error: null });

        // ビジネスロジック層への決済パラメータ作成
        const paymentParams = {
          amount: paymentInfo.total,
          paymentMethod:
            paymentInfo.selectedPaymentMethod === "wallet"
              ? ("bank_transfer" as const)
              : ("credit_card" as const),
          description: paymentInfo.product.name,
          metadata: {
            productId: paymentInfo.product.id,
            ecoFriendly: paymentInfo.product.isEcoFriendly,
            donationIncluded: paymentInfo.options.includeDonation,
            donationAmount: paymentInfo.donationAmount,
          },
        };

        // ビジネスロジック層の決済処理を実行
        const result = await businessProcessPayment(paymentParams);

        return result.match(
          (paymentState) => {
            // 成功時の処理
            // トランザクションストアから関数を取得
            const addTransaction =
              useTransactionStore.getState().addTransaction;

            // 新しいトランザクションを作成
            const newTransaction = {
              type: "payment" as const,
              description: paymentInfo.product.name,
              date: new Date()
                .toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "/"),
              amount: -paymentInfo.total,
              ecoContribution: paymentInfo.options.includeDonation
                ? {
                    enabled: true,
                    amount: paymentInfo.donationAmount,
                  }
                : undefined,
              badges: paymentInfo.product.isEcoFriendly ? ["環境貢献"] : [],
            };

            // トランザクションをストアに追加して、生成されたIDを取得
            const transactionId = addTransaction(newTransaction);

            set({ paymentStatus: "success" });

            return {
              success: true,
              transactionId: paymentState.transactionId || transactionId,
            };
          },
          (businessError) => {
            // エラー時の処理
            const errorMessage = getErrorMessage(businessError);
            set({ paymentStatus: "error", error: errorMessage });
            return { success: false, error: errorMessage };
          },
        );
      },

      resetPayment: () => set(initialState),
    }),
    {
      name: "payment-store",
    },
  ),
);
