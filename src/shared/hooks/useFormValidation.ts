"use client";

import { useState, useCallback } from "react";

export type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => boolean;
};

export type ValidationErrors = Record<string, string | null>;

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (name: string, value: string, rules: ValidationRules): string | null => {
      if (rules.required && !value) {
        return "この項目は必須です";
      }

      if (rules.minLength && value.length < rules.minLength) {
        return `${rules.minLength}文字以上入力してください`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `${rules.maxLength}文字以内で入力してください`;
      }

      if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
        return "有効なメールアドレスを入力してください";
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return "入力形式が正しくありません";
      }

      if (rules.custom && !rules.custom(value)) {
        return "入力内容を確認してください";
      }

      return null;
    },
    [],
  );

  const validateForm = useCallback(
    (
      formData: Record<string, string>,
      rulesMap: Record<string, ValidationRules>,
    ): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      Object.entries(rulesMap).forEach(([fieldName, rules]) => {
        const error = validateField(
          fieldName,
          formData[fieldName] || "",
          rules,
        );
        newErrors[fieldName] = error;
        if (error) isValid = false;
      });

      setErrors(newErrors);
      return isValid;
    },
    [validateField],
  );

  return { errors, validateField, validateForm, setErrors };
}
