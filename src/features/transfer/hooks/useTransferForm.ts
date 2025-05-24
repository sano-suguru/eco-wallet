import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";
import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { TransferFormData, Recipient } from "../types/transfer";
import {
  validateTransferForm,
  calculateEcoDonation,
} from "../utils/validation";

export const useTransferForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const subtractFromRegularBalance = useBalanceStore(
    (state) => state.subtractFromRegularBalance,
  );

  // フォームの状態
  const [formData, setFormData] = useState<TransferFormData>({
    recipient: "",
    selectedRecipient: null,
    amount: "",
    message: "",
    isDonateChecked: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // フォームフィールドの更新
  const updateField = <K extends keyof TransferFormData>(
    field: K,
    value: TransferFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // エラーをクリア
  };

  // 受取人を選択
  const selectRecipient = (recipient: Recipient) => {
    setFormData((prev) => ({
      ...prev,
      selectedRecipient: recipient,
      recipient: recipient.name,
    }));
  };

  // 送金処理
  const handleTransfer = async (): Promise<void> => {
    setError(null);

    const userBalance = session?.user?.balance || 0;
    const validation = validateTransferForm(formData, userBalance);

    if (!validation.isValid) {
      setError(validation.error || "バリデーションエラー");
      return;
    }

    setIsProcessing(true);

    try {
      // 送金処理のモック - 実際のAPIコールの代わりにタイマーを使用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const recipientName = formData.selectedRecipient
        ? formData.selectedRecipient.name
        : formData.recipient;
      const transferAmount = Number(formData.amount);
      const donationAmount = formData.isDonateChecked
        ? calculateEcoDonation(transferAmount)
        : 0;
      const totalDeduction = transferAmount + donationAmount;

      // トランザクションの追加
      const transactionId = addTransaction({
        type: "payment",
        description: `${recipientName}へ送金`,
        date: new Date()
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "/"),
        amount: -totalDeduction,
        ecoContribution: formData.isDonateChecked
          ? {
              enabled: true,
              amount: donationAmount,
            }
          : undefined,
      });

      // 残高の更新
      subtractFromRegularBalance(totalDeduction);

      // 成功状態にする
      setIsSuccess(true);

      // 3秒後にリダイレクト
      setTimeout(() => {
        router.push(`/history/${transactionId}`);
      }, 3000);

      return;
    } catch (error) {
      console.error("送金処理中にエラーが発生しました", error);
      setError("送金処理に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  // 計算値
  const transferAmount = Number(formData.amount) || 0;
  const donationAmount = formData.isDonateChecked
    ? calculateEcoDonation(transferAmount)
    : 0;
  const totalAmount = transferAmount + donationAmount;

  return {
    formData,
    updateField,
    selectRecipient,
    handleTransfer,
    isProcessing,
    error,
    isSuccess,
    transferAmount,
    donationAmount,
    totalAmount,
  };
};
