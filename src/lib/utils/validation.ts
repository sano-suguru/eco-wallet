/**
 * メールアドレスの検証
 * @param email メールアドレス
 * @returns 有効な場合true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

/**
 * パスワードの強度を確認
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
 * 金額の検証
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
