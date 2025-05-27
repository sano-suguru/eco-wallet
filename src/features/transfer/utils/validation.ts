import { Result, ok, err } from "neverthrow";
import { AppError } from "@/shared/types/errors";
import {
  validateAmountResult,
  validateEmailResult,
  validateRequiredField,
} from "@/lib/utils/validation";
import {
  TransferFormData,
  SplitFormData,
  SplitParticipant,
  Recipient,
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

// =============================================================================
// Result型対応のバリデーション関数（新規）
// =============================================================================

/**
 * 送金フォームのバリデーション（Result型版）
 */
export const validateTransferFormResult = (
  formData: TransferFormData,
  userBalance: number,
): Result<TransferFormData, AppError> => {
  const { selectedRecipient, recipient, amount, isDonateChecked } = formData;

  // 送金先のチェック
  if (!selectedRecipient && !recipient) {
    return err({
      type: "REQUIRED_FIELD",
      message: "送金先を選択または入力してください",
      field: "recipient",
    });
  }

  // 金額のバリデーション
  const amountValidation = validateAmountResult(amount);
  if (amountValidation.isErr()) {
    return err(amountValidation.error);
  }

  const amountNum = amountValidation.value;
  const donationAmount = isDonateChecked ? calculateEcoDonation(amountNum) : 0;
  const totalAmount = amountNum + donationAmount;

  // 残高チェック
  if (totalAmount > userBalance) {
    return err({
      type: "INSUFFICIENT_BALANCE",
      message: "残高が不足しています",
      required: totalAmount,
      available: userBalance,
    });
  }

  return ok(formData);
};

/**
 * 割り勘フォームのバリデーション（Result型版）
 */
export const validateSplitFormResult = (
  formData: SplitFormData,
): Result<SplitFormData, AppError> => {
  const { splitTitle, totalAmount, participants } = formData;

  // タイトルのチェック
  const titleValidation = validateRequiredField(splitTitle, "タイトル");
  if (titleValidation.isErr()) {
    return err(titleValidation.error);
  }

  // 合計金額のチェック
  const totalAmountValidation = validateAmountResult(totalAmount);
  if (totalAmountValidation.isErr()) {
    return err({
      ...totalAmountValidation.error,
      message: "有効な合計金額を入力してください",
    });
  }

  const totalAmountNum = totalAmountValidation.value;

  // 参加者の金額合計チェック
  const participantsTotal = participants.reduce((sum, p) => {
    const pAmount = Number(p.amount) || 0;
    return sum + pAmount;
  }, 0);

  if (participantsTotal !== totalAmountNum) {
    return err({
      type: "INVALID_FORMAT",
      message: `参加者の金額合計（${participantsTotal}円）が合計金額（${totalAmount}円）と一致しません`,
      field: "participants",
      expected: `合計${totalAmountNum}円`,
    });
  }

  // メールアドレスのチェック
  const missingEmailParticipant = participants.find(
    (p) => !p.isEcoUser && p.id !== "self" && !p.email,
  );
  if (missingEmailParticipant) {
    return err({
      type: "REQUIRED_FIELD",
      message: `${missingEmailParticipant.name}のメールアドレスを入力してください`,
      field: "email",
    });
  }

  // 各参加者のメールアドレスの形式チェック
  for (const participant of participants) {
    if (participant.email && participant.id !== "self") {
      const emailValidation = validateEmailResult(participant.email);
      if (emailValidation.isErr()) {
        return err({
          ...emailValidation.error,
          message: `${participant.name}のメールアドレスが正しくありません`,
        });
      }
    }
  }

  return ok(formData);
};

/**
 * 送金金額の妥当性チェック（Result型版）
 */
export const validateTransferAmountResult = (
  amount: string,
  userBalance: number,
  isDonateChecked: boolean = false,
): Result<
  { transferAmount: number; donationAmount: number; totalAmount: number },
  AppError
> => {
  // 金額のバリデーション
  const amountValidation = validateAmountResult(amount);
  if (amountValidation.isErr()) {
    return err(amountValidation.error);
  }

  const transferAmount = amountValidation.value;
  const donationAmount = isDonateChecked
    ? calculateEcoDonation(transferAmount)
    : 0;
  const totalAmount = transferAmount + donationAmount;

  // 残高チェック
  if (totalAmount > userBalance) {
    return err({
      type: "INSUFFICIENT_BALANCE",
      message: "残高が不足しています",
      required: totalAmount,
      available: userBalance,
    });
  }

  return ok({
    transferAmount,
    donationAmount,
    totalAmount,
  });
};

/**
 * 受取人情報の検証（Result型版）
 */
export const validateRecipientResult = (
  selectedRecipient: Recipient | null,
  recipientInput: string,
): Result<string, AppError> => {
  if (selectedRecipient) {
    return ok(selectedRecipient.name);
  }

  const recipientValidation = validateRequiredField(recipientInput, "送金先");
  if (recipientValidation.isErr()) {
    return err(recipientValidation.error);
  }

  return ok(recipientValidation.value);
};
