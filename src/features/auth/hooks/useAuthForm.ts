"use client";

import { useState, FormEvent } from "react";
import { Result } from "neverthrow";
import { AppError } from "@/shared/types/errors";

// Result型対応のバリデーション型定義
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, AppError | null>;
}

// フォームバリデーション関数の型定義
export type FormValidationFunction = (
  values: Record<string, string>,
) => ValidationResult;

interface UseAuthFormConfig {
  initialValues: Record<string, string>;
  validateForm: FormValidationFunction;
  onSubmit: (values: Record<string, string>) => Promise<Result<void, AppError>>;
}

export function useAuthForm({
  initialValues,
  validateForm,
  onSubmit,
}: UseAuthFormConfig) {
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, AppError | null>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // フィールド変更時にそのフィールドのエラーをクリア
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // フォームバリデーション
    const validation = validateForm(values);
    setFieldErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await onSubmit(values);

      result.match(
        () => {
          // 成功時の処理（何もしない、呼び出し元で処理）
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
      setIsLoading(false);
    }
  };

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

  return {
    values,
    setValues,
    fieldErrors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    clearError,
    clearFieldError,
    clearAllErrors,
  };
}
