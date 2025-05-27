/**
 * 認証フォーム用のバリデーション関数
 */

import { AppError } from "@/shared/types/errors";
import {
  validateEmailResult,
  validatePasswordResult,
  validateRequiredField,
  validatePasswordConfirmation,
} from "@/lib/utils/validation";
import { ValidationResult } from "../hooks/useAuthForm";

/**
 * ログインフォームのバリデーション
 */
export function validateLoginForm(
  values: Record<string, string>,
): ValidationResult {
  const errors: Record<string, AppError | null> = {};
  let isValid = true;

  // メールアドレスの検証
  const emailResult = validateEmailResult(values.email || "");
  if (emailResult.isErr()) {
    errors.email = emailResult.error;
    isValid = false;
  } else {
    errors.email = null;
  }

  // パスワードの検証（ログイン時は必須チェックのみ）
  const passwordResult = validateRequiredField(
    values.password || "",
    "パスワード",
  );
  if (passwordResult.isErr()) {
    errors.password = passwordResult.error;
    isValid = false;
  } else {
    errors.password = null;
  }

  return { isValid, errors };
}

/**
 * 登録フォームのバリデーション
 */
export function validateRegisterForm(
  values: Record<string, string>,
): ValidationResult {
  const errors: Record<string, AppError | null> = {};
  let isValid = true;

  // 名前の検証
  const nameResult = validateRequiredField(values.name || "", "お名前");
  if (nameResult.isErr()) {
    errors.name = nameResult.error;
    isValid = false;
  } else {
    errors.name = null;
  }

  // メールアドレスの検証
  const emailResult = validateEmailResult(values.email || "");
  if (emailResult.isErr()) {
    errors.email = emailResult.error;
    isValid = false;
  } else {
    errors.email = null;
  }

  // パスワードの検証
  const passwordResult = validatePasswordResult(values.password || "");
  if (passwordResult.isErr()) {
    errors.password = passwordResult.error;
    isValid = false;
  } else {
    errors.password = null;
  }

  // パスワード確認の検証
  const confirmPasswordResult = validatePasswordConfirmation(
    values.password || "",
    values.confirmPassword || "",
  );
  if (confirmPasswordResult.isErr()) {
    errors.confirmPassword = confirmPasswordResult.error;
    isValid = false;
  } else {
    errors.confirmPassword = null;
  }

  // 利用規約同意の検証
  if (!values.agreeTerms || values.agreeTerms !== "true") {
    errors.agreeTerms = {
      type: "REQUIRED_FIELD",
      message: "利用規約とプライバシーポリシーに同意してください",
      field: "agreeTerms",
    };
    isValid = false;
  } else {
    errors.agreeTerms = null;
  }

  // 招待コードの検証（任意項目だが、入力されている場合は形式チェック）
  if (values.referralCode && values.referralCode.trim() !== "") {
    if (!values.referralCode.startsWith("ECO")) {
      errors.referralCode = {
        type: "INVALID_FORMAT",
        message: "招待コードはECOから始まる英数字である必要があります",
        field: "referralCode",
        expected: "ECOから始まる英数字",
      };
      isValid = false;
    } else {
      errors.referralCode = null;
    }
  } else {
    errors.referralCode = null;
  }

  return { isValid, errors };
}

/**
 * パスワードリセットフォームのバリデーション
 */
export function validateForgotPasswordForm(
  values: Record<string, string>,
): ValidationResult {
  const errors: Record<string, AppError | null> = {};
  let isValid = true;

  // メールアドレスの検証
  const emailResult = validateEmailResult(values.email || "");
  if (emailResult.isErr()) {
    errors.email = emailResult.error;
    isValid = false;
  } else {
    errors.email = null;
  }

  return { isValid, errors };
}

/**
 * パスワード変更フォームのバリデーション
 */
export function validateChangePasswordForm(
  values: Record<string, string>,
): ValidationResult {
  const errors: Record<string, AppError | null> = {};
  let isValid = true;

  // 現在のパスワードの検証
  const currentPasswordResult = validateRequiredField(
    values.currentPassword || "",
    "現在のパスワード",
  );
  if (currentPasswordResult.isErr()) {
    errors.currentPassword = currentPasswordResult.error;
    isValid = false;
  } else {
    errors.currentPassword = null;
  }

  // 新しいパスワードの検証
  const newPasswordResult = validatePasswordResult(values.newPassword || "");
  if (newPasswordResult.isErr()) {
    errors.newPassword = newPasswordResult.error;
    isValid = false;
  } else {
    errors.newPassword = null;
  }

  // 新しいパスワード確認の検証
  const confirmNewPasswordResult = validatePasswordConfirmation(
    values.newPassword || "",
    values.confirmNewPassword || "",
  );
  if (confirmNewPasswordResult.isErr()) {
    errors.confirmNewPassword = confirmNewPasswordResult.error;
    isValid = false;
  } else {
    errors.confirmNewPassword = null;
  }

  return { isValid, errors };
}
