import {
  TransferFormData,
  SplitFormData,
  SplitParticipant,
} from "../types/transfer";

/**
 * 送金フォームのバリデーション
 */
export const validateTransferForm = (
  formData: TransferFormData,
  userBalance: number,
): { isValid: boolean; error?: string } => {
  const { selectedRecipient, recipient, amount, isDonateChecked } = formData;

  // 送金先のチェック
  if (!selectedRecipient && !recipient) {
    return { isValid: false, error: "送金先を選択または入力してください" };
  }

  // 金額のチェック
  const amountNum = Number(amount);
  if (!amount || isNaN(amountNum) || amountNum <= 0) {
    return { isValid: false, error: "有効な金額を入力してください" };
  }

  // 残高チェック
  const donationAmount = isDonateChecked ? Math.ceil(amountNum * 0.01) : 0;
  const totalAmount = amountNum + donationAmount;

  if (totalAmount > userBalance) {
    return { isValid: false, error: "残高が不足しています" };
  }

  return { isValid: true };
};

/**
 * 割り勘フォームのバリデーション
 */
export const validateSplitForm = (
  formData: SplitFormData,
): { isValid: boolean; error?: string } => {
  const { splitTitle, totalAmount, participants } = formData;

  // タイトルのチェック
  if (!splitTitle) {
    return { isValid: false, error: "タイトルを入力してください" };
  }

  // 合計金額のチェック
  const totalAmountNum = Number(totalAmount);
  if (!totalAmount || isNaN(totalAmountNum) || totalAmountNum <= 0) {
    return { isValid: false, error: "有効な合計金額を入力してください" };
  }

  // 参加者の金額合計チェック
  const participantsTotal = participants.reduce((sum, p) => {
    const pAmount = Number(p.amount) || 0;
    return sum + pAmount;
  }, 0);

  if (participantsTotal !== totalAmountNum) {
    return {
      isValid: false,
      error: `参加者の金額合計（${participantsTotal}円）が合計金額（${totalAmount}円）と一致しません`,
    };
  }

  // メールアドレスのチェック
  const missingEmail = participants.find(
    (p) => !p.isEcoUser && p.id !== "self" && !p.email,
  );
  if (missingEmail) {
    return {
      isValid: false,
      error: `${missingEmail.name}のメールアドレスを入力してください`,
    };
  }

  return { isValid: true };
};

/**
 * 環境貢献額を計算
 */
export const calculateEcoDonation = (amount: number): number => {
  return Math.ceil(amount * 0.01);
};

/**
 * 参加者に均等に金額を分配
 */
export const distributeAmountEvenly = (
  totalAmount: number,
  participants: SplitParticipant[],
): SplitParticipant[] => {
  const totalAmountNum = Number(totalAmount);
  if (
    isNaN(totalAmountNum) ||
    totalAmountNum <= 0 ||
    participants.length === 0
  ) {
    return participants;
  }

  const evenAmount = Math.floor(totalAmountNum / participants.length);
  const remainder = totalAmountNum - evenAmount * participants.length;

  return participants.map((p, index) => ({
    ...p,
    amount: index === 0 ? String(evenAmount + remainder) : String(evenAmount),
  }));
};

/**
 * 自分以外の参加者から回収する金額を計算
 */
export const calculateReceivableAmount = (
  participants: SplitParticipant[],
): number => {
  return participants
    .filter((p) => p.id !== "self")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
};

/**
 * メールアドレスのバリデーション
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
