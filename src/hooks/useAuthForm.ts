"use client";

import { useState, FormEvent } from "react";
import { useFormValidation, ValidationRules } from "@/hooks/useFormValidation";

interface UseAuthFormConfig {
  initialValues: Record<string, string>;
  validationRules: Record<string, ValidationRules>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export function useAuthForm({
  initialValues,
  validationRules,
  onSubmit,
}: UseAuthFormConfig) {
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { errors, validateForm } = useFormValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // フォームバリデーション
    const isValid = validateForm(values, validationRules);
    if (!isValid) return;

    setIsLoading(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    setValues,
    errors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}
