import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";
import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { SplitFormData, SplitParticipant } from "../types/transfer";
import {
  validateSplitForm,
  calculateEcoDonation,
  distributeAmountEvenly,
  calculateReceivableAmount,
} from "../utils/validation";
import { defaultParticipants } from "../data/recipients-data";

export const useSplitForm = () => {
  const router = useRouter();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const subtractFromRegularBalance = useBalanceStore(
    (state) => state.subtractFromRegularBalance,
  );

  // フォームの状態
  const [formData, setFormData] = useState<SplitFormData>({
    splitTitle: "",
    totalAmount: "",
    participants: defaultParticipants,
    isReceiptDisabled: true,
    splitMethod: "wallet",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // フォームフィールドの更新
  const updateField = <K extends keyof SplitFormData>(
    field: K,
    value: SplitFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // エラーをクリア
  };

  // 参加者の金額を更新
  const updateParticipantAmount = (id: string, amount: string) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === id ? { ...p, amount } : p,
      ),
    }));
  };

  // 参加者のメールアドレスを更新
  const updateParticipantEmail = (id: string, email: string) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === id ? { ...p, email } : p,
      ),
    }));
  };

  // 均等に金額を分ける
  const distributeEvenly = () => {
    if (
      !formData.totalAmount ||
      isNaN(Number(formData.totalAmount)) ||
      Number(formData.totalAmount) <= 0
    ) {
      setError("有効な合計金額を入力してください");
      return;
    }

    const updatedParticipants = distributeAmountEvenly(
      Number(formData.totalAmount),
      formData.participants,
    );

    setFormData((prev) => ({
      ...prev,
      participants: updatedParticipants,
    }));
  };

  // 参加者を追加
  const addParticipant = (name: string, isEcoUser: boolean = false) => {
    const newParticipant: SplitParticipant = {
      id: `p${Date.now()}`,
      name,
      isEcoUser,
      amount: "",
      email: "",
    };

    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));
  };

  // 参加者を削除
  const removeParticipant = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== id),
    }));
  };

  // 割り勘処理
  const handleSplitRequest = async (): Promise<void> => {
    setError(null);

    const validation = validateSplitForm(formData);
    if (!validation.isValid) {
      setError(validation.error || "バリデーションエラー");
      return;
    }

    setIsProcessing(true);

    try {
      // 割り勘処理のモック - 実際のAPIコールの代わりにタイマーを使用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const totalAmount = Number(formData.totalAmount);
      const donationAmount = calculateEcoDonation(totalAmount);

      // トランザクションの追加（立替分）
      const transactionId = addTransaction({
        type: "payment",
        description: `${formData.splitTitle}（立替）`,
        date: new Date()
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "/"),
        amount: -totalAmount,
        ecoContribution: {
          enabled: true,
          amount: donationAmount,
        },
        badges: ["割り勘"],
      });

      // 他の参加者からの入金予定
      const receivableAmount = calculateReceivableAmount(formData.participants);

      if (receivableAmount > 0) {
        addTransaction({
          type: "receive",
          description: `${formData.splitTitle}（割り勘請求）`,
          date: new Date()
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "/"),
          amount: receivableAmount,
          badges: ["割り勘", "未受取"],
        });
      }

      // 残高の更新（立替分）
      subtractFromRegularBalance(totalAmount);

      // 成功状態にする
      setIsSuccess(true);

      // 3秒後にリダイレクト
      setTimeout(() => {
        router.push(`/history/${transactionId}`);
      }, 3000);

      return;
    } catch (error) {
      console.error("割り勘処理中にエラーが発生しました", error);
      setError("割り勘処理に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  // 計算値
  const totalAmount = Number(formData.totalAmount) || 0;
  const receivableAmount = calculateReceivableAmount(formData.participants);
  const donationAmount = calculateEcoDonation(totalAmount);

  return {
    formData,
    updateField,
    updateParticipantAmount,
    updateParticipantEmail,
    distributeEvenly,
    addParticipant,
    removeParticipant,
    handleSplitRequest,
    isProcessing,
    error,
    isSuccess,
    totalAmount,
    receivableAmount,
    donationAmount,
  };
};
