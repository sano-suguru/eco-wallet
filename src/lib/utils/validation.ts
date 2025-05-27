/**
 * バリデーション関数
 *
 * このファイルには従来のバリデーション関数とResult型対応の新しいバリデーション関数が含まれています。
 * neverthrow導入の段階的移行のため、両方の形式をサポートしています。
 */

import { Result, ok, err } from "neverthrow";
import { ValidationError } from "@/shared/types/errors";

// =============================================================================
// 従来のバリデーション関数（段階的移行のため残存）
// =============================================================================

/**
 * メールアドレスの検証（従来版）
 * @param email メールアドレス
 * @returns 有効な場合true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

/**
 * パスワードの強度を確認（従来版）
 * @param password パスワード
 * @returns 検証結果と理由
 */
export function validatePassword(password: string): {
  isValid: boolean;
  reason?: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      reason: "パスワードは8文字以上である必要があります",
    };
  }

  // 数字を含むか
  if (!/\d/.test(password)) {
    return { isValid: false, reason: "パスワードは数字を含む必要があります" };
  }

  // 記号を含むか
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, reason: "パスワードは記号を含む必要があります" };
  }

  return { isValid: true };
}

/**
 * 金額の検証（従来版）
 * @param amount 金額文字列
 * @param min 最小値
 * @param max 最大値
 * @returns 検証結果と理由
 */
export function validateAmount(
  amount: string,
  min?: number,
  max?: number,
): { isValid: boolean; reason?: string } {
  const numAmount = Number(amount);

  if (isNaN(numAmount)) {
    return { isValid: false, reason: "有効な金額を入力してください" };
  }

  if (numAmount <= 0) {
    return {
      isValid: false,
      reason: "金額は0より大きい値である必要があります",
    };
  }

  if (min !== undefined && numAmount < min) {
    return { isValid: false, reason: `金額は${min}円以上である必要があります` };
  }

  if (max !== undefined && numAmount > max) {
    return { isValid: false, reason: `金額は${max}円以下である必要があります` };
  }

  return { isValid: true };
}

// =============================================================================
// Result型対応のバリデーション関数（新規）
// =============================================================================

/**
 * メールアドレスの検証（Result型版）
 * @param email メールアドレス
 * @returns Result型での検証結果
 */
export function validateEmailResult(
  email: string,
): Result<string, ValidationError> {
  if (!email || email.trim() === "") {
    return err({
      type: "REQUIRED_FIELD",
      message: "メールアドレスは必須です",
      field: "email",
    });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return err({
      type: "INVALID_EMAIL",
      message: "有効なメールアドレスを入力してください",
      field: "email",
    });
  }

  return ok(email);
}

/**
 * パスワードの強度を確認（Result型版）
 * @param password パスワード
 * @returns Result型での検証結果
 */
export function validatePasswordResult(
  password: string,
): Result<string, ValidationError> {
  if (!password || password.trim() === "") {
    return err({
      type: "REQUIRED_FIELD",
      message: "パスワードは必須です",
      field: "password",
    });
  }

  const requirements: string[] = [];

  if (password.length < 8) {
    requirements.push("8文字以上");
  }

  if (!/\d/.test(password)) {
    requirements.push("数字を含む");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    requirements.push("記号を含む");
  }

  if (requirements.length > 0) {
    return err({
      type: "INVALID_PASSWORD",
      message: `パスワードは以下の条件を満たす必要があります: ${requirements.join("、")}`,
      field: "password",
      requirements,
    });
  }

  return ok(password);
}

/**
 * 金額の検証（Result型版）
 * @param amount 金額文字列
 * @param min 最小値
 * @param max 最大値
 * @returns Result型での検証結果（成功時は数値を返す）
 */
export function validateAmountResult(
  amount: string,
  min?: number,
  max?: number,
): Result<number, ValidationError> {
  if (!amount || amount.trim() === "") {
    return err({
      type: "REQUIRED_FIELD",
      message: "金額は必須です",
      field: "amount",
    });
  }

  const numAmount = Number(amount);

  if (isNaN(numAmount)) {
    return err({
      type: "INVALID_AMOUNT",
      message: "有効な金額を入力してください",
      field: "amount",
    });
  }

  if (numAmount <= 0) {
    return err({
      type: "INVALID_AMOUNT",
      message: "金額は0より大きい値である必要があります",
      field: "amount",
      min: 1,
    });
  }

  if (min !== undefined && numAmount < min) {
    return err({
      type: "INVALID_RANGE",
      message: `金額は${min}円以上である必要があります`,
      field: "amount",
      min,
      max: max || Number.MAX_SAFE_INTEGER,
      actual: numAmount,
    });
  }

  if (max !== undefined && numAmount > max) {
    return err({
      type: "INVALID_RANGE",
      message: `金額は${max}円以下である必要があります`,
      field: "amount",
      min: min || 0,
      max,
      actual: numAmount,
    });
  }

  return ok(numAmount);
}

/**
 * 必須フィールドの検証（Result型版）
 * @param value 検証対象の値
 * @param fieldName フィールド名
 * @returns Result型での検証結果
 */
export function validateRequiredField(
  value: string | null | undefined,
  fieldName: string,
): Result<string, ValidationError> {
  if (!value || value.trim() === "") {
    return err({
      type: "REQUIRED_FIELD",
      message: `${fieldName}は必須項目です`,
      field: fieldName,
    });
  }

  return ok(value.trim());
}

/**
 * パスワード確認の検証（Result型版）
 * @param password パスワード
 * @param confirmPassword 確認用パスワード
 * @returns Result型での検証結果
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): Result<string, ValidationError> {
  if (password !== confirmPassword) {
    return err({
      type: "PASSWORD_MISMATCH",
      message: "パスワードが一致しません",
      fields: ["password", "confirmPassword"],
    });
  }

  return ok(password);
}

/**
 * 文字列の長さ検証（Result型版）
 * @param value 検証対象の値
 * @param fieldName フィールド名
 * @param minLength 最小長
 * @param maxLength 最大長
 * @returns Result型での検証結果
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  minLength?: number,
  maxLength?: number,
): Result<string, ValidationError> {
  if (minLength !== undefined && value.length < minLength) {
    return err({
      type: "INVALID_RANGE",
      message: `${fieldName}は${minLength}文字以上である必要があります`,
      field: fieldName,
      min: minLength,
      max: maxLength || Number.MAX_SAFE_INTEGER,
      actual: value.length,
    });
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return err({
      type: "INVALID_RANGE",
      message: `${fieldName}は${maxLength}文字以下である必要があります`,
      field: fieldName,
      min: minLength || 0,
      max: maxLength,
      actual: value.length,
    });
  }

  return ok(value);
}

/**
 * 数値範囲の検証（Result型版）
 * @param value 検証対象の数値
 * @param fieldName フィールド名
 * @param min 最小値
 * @param max 最大値
 * @returns Result型での検証結果
 */
export function validateNumberRange(
  value: number,
  fieldName: string,
  min?: number,
  max?: number,
): Result<number, ValidationError> {
  if (min !== undefined && value < min) {
    return err({
      type: "INVALID_RANGE",
      message: `${fieldName}は${min}以上である必要があります`,
      field: fieldName,
      min,
      max: max || Number.MAX_SAFE_INTEGER,
      actual: value,
    });
  }

  if (max !== undefined && value > max) {
    return err({
      type: "INVALID_RANGE",
      message: `${fieldName}は${max}以下である必要があります`,
      field: fieldName,
      min: min || Number.MIN_SAFE_INTEGER,
      max,
      actual: value,
    });
  }

  return ok(value);
}

/**
 * 電話番号の検証（Result型版）
 * @param phone 電話番号
 * @returns Result型での検証結果
 */
export function validatePhoneResult(
  phone: string,
): Result<string, ValidationError> {
  if (!phone || phone.trim() === "") {
    return err({
      type: "REQUIRED_FIELD",
      message: "電話番号は必須です",
      field: "phone",
    });
  }

  // 日本の電話番号の基本的なパターンをチェック
  // 090-XXXX-XXXX、080-XXXX-XXXX、070-XXXX-XXXX、03-XXXX-XXXX など
  const phoneRegex = /^(\d{2,4}-\d{4}-\d{4}|\d{10,11})$/;
  const cleanPhone = phone.replace(/[-\s]/g, "");

  if (!phoneRegex.test(phone) && !/^\d{10,11}$/.test(cleanPhone)) {
    return err({
      type: "INVALID_FORMAT",
      message: "有効な電話番号を入力してください（例: 090-1234-5678）",
      field: "phone",
      expected: "XXX-XXXX-XXXX形式",
    });
  }

  return ok(phone);
}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;

  describe("validateEmailResult", () => {
    test("validates correct email", () => {
      const result = validateEmailResult("test@example.com");
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr("")).toBe("test@example.com");
    });

    test("rejects invalid email", () => {
      const result = validateEmailResult("invalid-email");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("INVALID_EMAIL");
      }
    });

    test("rejects empty email", () => {
      const result = validateEmailResult("");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("REQUIRED_FIELD");
      }
    });
  });

  describe("validatePasswordResult", () => {
    test("validates strong password", () => {
      const result = validatePasswordResult("MyPass123!");
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr("")).toBe("MyPass123!");
    });

    test("rejects weak password", () => {
      const result = validatePasswordResult("weak");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("INVALID_PASSWORD");
        if (result.error.type === "INVALID_PASSWORD") {
          expect(result.error.requirements?.length).toBeGreaterThan(0);
        }
      }
    });

    test("rejects empty password", () => {
      const result = validatePasswordResult("");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("REQUIRED_FIELD");
      }
    });
  });

  describe("validateAmountResult", () => {
    test("validates correct amount", () => {
      const result = validateAmountResult("1000");
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr(0)).toBe(1000);
    });

    test("validates amount with range", () => {
      const result = validateAmountResult("500", 100, 1000);
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr(0)).toBe(500);
    });

    test("rejects amount below minimum", () => {
      const result = validateAmountResult("50", 100, 1000);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("INVALID_RANGE");
      }
    });

    test("rejects amount above maximum", () => {
      const result = validateAmountResult("1500", 100, 1000);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("INVALID_RANGE");
      }
    });

    test("rejects invalid number", () => {
      const result = validateAmountResult("not-a-number");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("INVALID_AMOUNT");
      }
    });

    test("rejects empty amount", () => {
      const result = validateAmountResult("");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("REQUIRED_FIELD");
      }
    });
  });

  describe("validatePasswordConfirmation", () => {
    test("validates matching passwords", () => {
      const result = validatePasswordConfirmation("password123", "password123");
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr("")).toBe("password123");
    });

    test("rejects non-matching passwords", () => {
      const result = validatePasswordConfirmation("password123", "different");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("PASSWORD_MISMATCH");
      }
    });
  });

  describe("validateRequiredField", () => {
    test("validates non-empty field", () => {
      const result = validateRequiredField("value", "fieldName");
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr("")).toBe("value");
    });

    test("rejects empty field", () => {
      const result = validateRequiredField("", "fieldName");
      expect(result.isErr()).toBe(true);
      if (result.isErr() && result.error.type === "REQUIRED_FIELD") {
        expect(result.error.type).toBe("REQUIRED_FIELD");
        expect(result.error.field).toBe("fieldName");
      }
    });

    test("rejects null field", () => {
      const result = validateRequiredField(null, "fieldName");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("REQUIRED_FIELD");
      }
    });
  });
}
