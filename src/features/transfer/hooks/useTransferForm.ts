"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Result, ok, err } from "neverthrow";
import { useTransactionStore } from "@/features/transactions/store/transaction.slice";
import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { AppError } from "@/shared/types/errors";
import { TransferFormData, Recipient } from "../types/transfer";
import {
  validateTransferFormResult,
  calculateEcoDonation,
} from "../utils/validation";

// 送金フォームのバリデーション結果型
export interface TransferValidationResult {
  isValid: boolean;
  errors: Record<string, AppError | null>;
}

// 送金フォームのバリデーション関数型
export type TransferValidationFunction = (
  formData: TransferFormData,
  userBalance: number,
) => TransferValidationResult;

// 送金フォームのバリデーション関数
const validateTransferForm = (
  formData: TransferFormData,
  userBalance: number,
): TransferValidationResult => {
  const validation = validateTransferFormResult(formData, userBalance);

  if (validation.isOk()) {
    return {
      isValid: true,
      errors: {},
    };
  }

  const error = validation.error;
  const errors: Record<string, AppError | null> = {};

  // エラーのフィールド特定（型安全に）
  if ("field" in error) {
    errors[error.field] = error;
  } else if ("fields" in error) {
    // PASSWORD_MISMATCHなどの複数フィールドエラー
    error.fields.forEach((field) => {
      errors[field] = error;
    });
  } else {
    // 特定のフィールドに属さないエラーは amount に設定
    errors.amount = error;
  }

  return {
    isValid: false,
    errors,
  };
};

interface UseTransferFormProps {
  initialFormData?: Partial<TransferFormData>;
  onTransferSuccess?: (transactionId: string) => void;
}

export const useTransferForm = (props: UseTransferFormProps = {}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const subtractFromRegularBalance = useBalanceStore(
    (state) => state.subtractFromRegularBalance,
  );

  const { initialFormData = {}, onTransferSuccess } = props;

  // フォームの状態
  const [formData, setFormData] = useState<TransferFormData>({
    recipient: "",
    selectedRecipient: null,
    amount: "",
    message: "",
    isDonateChecked: true,
    ...initialFormData,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, AppError | null>
  >({});
  const [isSuccess, setIsSuccess] = useState(false);

  // フォームフィールドの更新
  const updateField = <K extends keyof TransferFormData>(
    field: K,
    value: TransferFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // フィールド変更時にそのフィールドのエラーをクリア
    if (fieldErrors[field as string]) {
      setFieldErrors((prev) => ({ ...prev, [field as string]: null }));
    }

    // グローバルエラーもクリア
    if (error) {
      setError(null);
    }
  };

  // 受取人を選択
  const selectRecipient = (recipient: Recipient) => {
    setFormData((prev) => ({
      ...prev,
      selectedRecipient: recipient,
      recipient: recipient.name,
    }));

    // 受取人フィールドのエラーをクリア
    if (fieldErrors.recipient) {
      setFieldErrors((prev) => ({ ...prev, recipient: null }));
    }
  };

  // 送金処理の実行
  const executeTransfer = async (): Promise<Result<string, AppError>> => {
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
      const transactionResult = addTransaction({
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

      if (transactionResult.isErr()) {
        // BusinessErrorをAppErrorに変換
        return err(transactionResult.error as AppError);
      }

      const transactionId = transactionResult.value;

      // 残高の更新
      subtractFromRegularBalance(totalDeduction);

      return ok(transactionId);
    } catch (error) {
      console.error("送金処理中にエラーが発生しました", error);
      return err({
        type: "SERVER_ERROR",
        message: "送金処理に失敗しました。時間をおいて再度お試しください。",
        statusCode: 500,
      });
    }
  };

  // 送金処理
  const handleTransfer = async (e?: FormEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
    }

    setError(null);
    setFieldErrors({});

    const userBalance = session?.user?.balance || 0;
    const validation = validateTransferForm(formData, userBalance);

    setFieldErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await executeTransfer();

      result.match(
        (transactionId) => {
          // 成功時の処理
          setIsSuccess(true);

          // コールバック実行
          if (onTransferSuccess) {
            onTransferSuccess(transactionId);
          } else {
            // デフォルトの成功処理：3秒後にリダイレクト
            setTimeout(() => {
              router.push(`/history/${transactionId}`);
            }, 3000);
          }
        },
        (err) => {
          setError(err);
        },
      );
    } catch (err) {
      // 予期しないエラーの場合
      setError({
        type: "SERVER_ERROR",
        message:
          err instanceof Error ? err.message : "予期しないエラーが発生しました",
        statusCode: 500,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // エラークリア関数
  const clearError = () => {
    setError(null);
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: null }));
  };

  const clearAllErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  // 計算値
  const transferAmount = Number(formData.amount) || 0;
  const donationAmount = formData.isDonateChecked
    ? calculateEcoDonation(transferAmount)
    : 0;
  const totalAmount = transferAmount + donationAmount;

  return {
    // フォームデータ
    formData,
    updateField,
    selectRecipient,

    // 処理関数
    handleTransfer,

    // 状態
    isProcessing,
    error,
    fieldErrors,
    isSuccess,

    // エラー管理
    clearError,
    clearFieldError,
    clearAllErrors,

    // 計算値
    transferAmount,
    donationAmount,
    totalAmount,
  };
};
