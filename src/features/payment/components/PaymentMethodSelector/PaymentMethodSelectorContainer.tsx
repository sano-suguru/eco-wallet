"use client";

import React, { useState, useMemo } from "react";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { ErrorMessage } from "@/components/ui/error-message";
import { getErrorMessage } from "@/lib/utils/error-utils";
import {
  validatePaymentMethod,
  validatePaymentAmount,
  calculatePaymentFee,
} from "@/lib/business/payment";
import type { PaymentMethod, PaymentMethodDetail } from "../../types/payment";
import type { BusinessError } from "@/shared/types/errors";

interface PaymentMethodSelectorContainerProps {
  methods: PaymentMethodDetail[];
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  paymentAmount?: number;
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

/**
 * PaymentMethodSelectorのContainer Component
 * Result型を使用した型安全なバリデーションとエラーハンドリングを提供
 */
export const PaymentMethodSelectorContainer: React.FC<
  PaymentMethodSelectorContainerProps
> = ({
  methods,
  selectedMethod,
  onMethodChange,
  paymentAmount,
  onValidationChange,
}) => {
  const [error, setError] = useState<string>("");

  // 選択された決済方法のバリデーション
  const methodValidationResult = useMemo(() => {
    // PaymentMethodからAPI用の文字列に変換
    const apiMethod =
      selectedMethod === "wallet" ? "bank_transfer" : "credit_card";
    return validatePaymentMethod(apiMethod);
  }, [selectedMethod]);

  // 決済手数料の計算
  const feeCalculationResult = useMemo(() => {
    if (!paymentAmount || paymentAmount <= 0) {
      return null;
    }

    const apiMethod =
      selectedMethod === "wallet" ? "bank_transfer" : "credit_card";
    return calculatePaymentFee(paymentAmount, apiMethod);
  }, [paymentAmount, selectedMethod]);

  // バリデーション結果の統合
  const validationResult = useMemo(() => {
    let validationError: BusinessError | null = null;

    // 決済方法のバリデーション
    if (methodValidationResult.isErr()) {
      validationError = methodValidationResult.error;
    }

    // 決済金額のバリデーション（金額が提供されている場合）
    if (paymentAmount !== undefined) {
      const amountValidationResult = validatePaymentAmount(paymentAmount);
      if (amountValidationResult.isErr()) {
        validationError = amountValidationResult.error;
      }
    }

    return {
      isValid: validationError === null,
      error: validationError,
      fee: feeCalculationResult?.isOk() ? feeCalculationResult.value : 0,
    };
  }, [methodValidationResult, paymentAmount, feeCalculationResult]);

  // バリデーション結果が変更された時の処理
  React.useEffect(() => {
    if (validationResult.error) {
      const errorMessage = getErrorMessage(validationResult.error);
      setError(errorMessage);
      onValidationChange?.(false, errorMessage);
    } else {
      setError("");
      onValidationChange?.(true);
    }
  }, [validationResult, onValidationChange]);

  // 決済方法変更時のハンドラー
  const handleMethodChange = (method: PaymentMethod) => {
    // エラーをクリア
    setError("");

    // 新しい決済方法を設定
    onMethodChange(method);
  };

  // 決済方法の詳細情報を追加（手数料情報など）
  const enhancedMethods = useMemo(() => {
    return methods.map((method) => {
      if (method.type === selectedMethod && validationResult.fee > 0) {
        return {
          ...method,
          label: `${method.label} (手数料: ¥${validationResult.fee.toLocaleString()})`,
        };
      }
      return method;
    });
  }, [methods, selectedMethod, validationResult.fee]);

  return (
    <div className="space-y-3">
      <PaymentMethodSelector
        methods={enhancedMethods}
        selectedMethod={selectedMethod}
        onMethodChange={handleMethodChange}
      />

      {error && <ErrorMessage message={error} />}

      {/* デバッグ情報（開発時のみ表示） */}
      {process.env.NODE_ENV === "development" && validationResult.fee > 0 && (
        <div className="text-xs text-stone-500 bg-stone-50 p-2 rounded border">
          <div>手数料: ¥{validationResult.fee.toLocaleString()}</div>
          <div>
            バリデーション: {validationResult.isValid ? "✅ 有効" : "❌ 無効"}
          </div>
        </div>
      )}
    </div>
  );
};
