/**
 * 残高管理のビジネスロジック関数
 * Result<T, BusinessError>を使用した型安全な残高管理
 */

import { Result, ok, err } from "neverthrow";
import type { BusinessError } from "@/shared/types/errors";
import type { ChargeRequest } from "@/services/api/balance";
import {
  fetchBalance as apiFetchBalance,
  chargeBalance as apiChargeBalance,
} from "@/services/api/balance";
import type { CampaignBalance } from "@/lib/utils/balance-utils";

/**
 * 残高計算結果の型定義
 */
export interface BalanceCalculationResult {
  totalBalance: number;
  availableBalance: number;
  reservedBalance: number;
  campaignBalance: number;
  breakdown: {
    regular: number;
    campaign: CampaignBalance[];
  };
}

/**
 * 残高チェック結果の型定義
 */
export interface BalanceCheckResult {
  hasSufficientFunds: boolean;
  availableAmount: number;
  shortfallAmount: number;
  suggestedChargeAmount: number;
}

/**
 * チャージパラメータの型定義
 */
export interface ChargeParams {
  amount: number;
  paymentMethod: "bank_transfer" | "credit_card" | "convenience_store" | "atm";
  description?: string;
}

/**
 * 送金パラメータの型定義
 */
export interface TransferParams {
  recipientId: string;
  amount: number;
  message?: string;
  description?: string;
}

/**
 * 残高状態の型定義
 */
export interface BalanceState {
  userId: string;
  currentBalance: number;
  availableBalance: number;
  pendingTransactions: number;
  lastUpdated: Date;
  limits: {
    dailySpendingLimit: number;
    monthlySpendingLimit: number;
    maxBalance: number;
  };
}

/**
 * チャージ金額のバリデーション
 * @param amount チャージ金額
 * @returns バリデーション結果
 */
export function validateChargeAmount(
  amount: number,
): Result<number, BusinessError> {
  if (amount <= 0) {
    return err({
      type: "CHARGE_MINIMUM_NOT_MET",
      message: "チャージ金額は0より大きい値である必要があります",
      minimum: 1,
      requested: amount,
    });
  }

  if (amount < 100) {
    return err({
      type: "CHARGE_MINIMUM_NOT_MET",
      message: "チャージ金額は100円以上である必要があります",
      minimum: 100,
      requested: amount,
    });
  }

  if (amount > 1000000) {
    return err({
      type: "TRANSACTION_LIMIT_EXCEEDED",
      message: "チャージ金額が上限を超えています（上限: 1,000,000円）",
      limit: 1000000,
      attempted: amount,
      limitType: "transaction",
    });
  }

  if (!Number.isInteger(amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "チャージ金額は整数である必要があります",
      reason: `小数点を含む金額: ${amount}`,
      paymentId: undefined,
    });
  }

  return ok(amount);
}

/**
 * 送金金額のバリデーション
 * @param amount 送金金額
 * @param availableBalance 利用可能残高
 * @returns バリデーション結果
 */
export function validateTransferAmount(
  amount: number,
  availableBalance: number,
): Result<number, BusinessError> {
  if (amount <= 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "送金金額は0より大きい値である必要があります",
      reason: `無効な金額: ${amount}`,
      paymentId: undefined,
    });
  }

  if (amount > availableBalance) {
    return err({
      type: "INSUFFICIENT_BALANCE",
      message: "残高が不足しています",
      required: amount,
      available: availableBalance,
    });
  }

  if (amount > 100000) {
    return err({
      type: "TRANSACTION_LIMIT_EXCEEDED",
      message: "送金金額が上限を超えています（上限: 100,000円）",
      limit: 100000,
      attempted: amount,
      limitType: "transaction",
    });
  }

  if (!Number.isInteger(amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "送金金額は整数である必要があります",
      reason: `小数点を含む金額: ${amount}`,
      paymentId: undefined,
    });
  }

  return ok(amount);
}

/**
 * 送金先のバリデーション
 * @param recipientId 送金先ユーザーID
 * @param senderId 送金者ユーザーID
 * @returns バリデーション結果
 */
export function validateTransferRecipient(
  recipientId: string,
  senderId: string,
): Result<string, BusinessError> {
  if (!recipientId || recipientId.trim().length === 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "送金先ユーザーIDが無効です",
      reason: `空のユーザーID: ${recipientId}`,
      paymentId: undefined,
    });
  }

  if (recipientId === senderId) {
    return err({
      type: "TRANSFER_TO_SELF",
      message: "自分自身への送金はできません",
    });
  }

  return ok(recipientId);
}

/**
 * 残高を計算する
 * @param regularBalance 通常残高
 * @param campaignBalances キャンペーン残高の配列
 * @returns 計算結果
 */
export function calculateTotalBalance(
  regularBalance: number,
  campaignBalances: CampaignBalance[] = [],
): Result<BalanceCalculationResult, BusinessError> {
  if (regularBalance < 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "通常残高が負の値です",
      reason: `無効な残高: ${regularBalance}`,
      paymentId: undefined,
    });
  }

  try {
    const campaignTotal = campaignBalances.reduce((sum, cb) => {
      if (cb.amount < 0) {
        throw new Error(`無効なキャンペーン残高: ${cb.amount}`);
      }
      return sum + cb.amount;
    }, 0);

    const totalBalance = regularBalance + campaignTotal;

    // 利用可能残高（期限切れを除く）
    const now = new Date();
    const availableCampaignBalances = campaignBalances.filter((cb) => {
      const expiryDate = new Date(cb.expiryDate);
      return expiryDate > now;
    });

    const availableCampaignTotal = availableCampaignBalances.reduce(
      (sum, cb) => sum + cb.amount,
      0,
    );

    const availableBalance = regularBalance + availableCampaignTotal;

    const result: BalanceCalculationResult = {
      totalBalance,
      availableBalance,
      reservedBalance: 0, // 予約済み残高（今回は0と仮定）
      campaignBalance: campaignTotal,
      breakdown: {
        regular: regularBalance,
        campaign: campaignBalances,
      },
    };

    return ok(result);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "残高計算中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 残高不足をチェックする
 * @param requiredAmount 必要金額
 * @param availableBalance 利用可能残高
 * @returns チェック結果
 */
export function checkSufficientBalance(
  requiredAmount: number,
  availableBalance: number,
): Result<BalanceCheckResult, BusinessError> {
  if (requiredAmount <= 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "必要金額は0より大きい値である必要があります",
      reason: `無効な金額: ${requiredAmount}`,
      paymentId: undefined,
    });
  }

  if (availableBalance < 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "利用可能残高が負の値です",
      reason: `無効な残高: ${availableBalance}`,
      paymentId: undefined,
    });
  }

  const hasSufficientFunds = availableBalance >= requiredAmount;
  const shortfallAmount = hasSufficientFunds
    ? 0
    : requiredAmount - availableBalance;

  // チャージ推奨金額（不足分 + 1000円のマージン）
  const suggestedChargeAmount = hasSufficientFunds
    ? 0
    : Math.ceil((shortfallAmount + 1000) / 1000) * 1000; // 1000円単位で切り上げ

  const result: BalanceCheckResult = {
    hasSufficientFunds,
    availableAmount: availableBalance,
    shortfallAmount,
    suggestedChargeAmount,
  };

  return ok(result);
}

/**
 * チャージを実行する
 * @param params チャージパラメータ
 * @returns チャージ結果
 */
export async function processCharge(
  params: ChargeParams,
): Promise<
  Result<
    { transactionId: string; amount: number; status: string },
    BusinessError
  >
> {
  // 金額のバリデーション
  const amountValidation = validateChargeAmount(params.amount);
  if (amountValidation.isErr()) {
    return err(amountValidation.error);
  }

  try {
    // API呼び出し用のリクエスト作成
    const chargeRequest: ChargeRequest = {
      amount: params.amount,
      paymentMethod: params.paymentMethod,
      paymentDetails: {
        description: params.description || "チャージ",
      },
    };

    // API呼び出し
    const apiResult = await apiChargeBalance(chargeRequest);

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "チャージ処理に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: undefined,
      });
    }

    const apiResponse = apiResult.value;

    return ok({
      transactionId: apiResponse.transactionId,
      amount: apiResponse.amount,
      status: apiResponse.status,
    });
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "チャージ処理中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 残高状態を取得・計算する
 * @param userId ユーザーID
 * @returns 残高状態
 */
export async function getBalanceState(
  userId?: string,
): Promise<Result<BalanceState, BusinessError>> {
  try {
    const balanceResult = await apiFetchBalance(userId);

    if (balanceResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "残高情報の取得に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: undefined,
      });
    }

    const balanceData = balanceResult.value;

    const balanceState: BalanceState = {
      userId: balanceData.userId,
      currentBalance: balanceData.currentBalance,
      availableBalance: balanceData.availableBalance,
      pendingTransactions: balanceData.pendingAmount,
      lastUpdated: new Date(balanceData.lastUpdated),
      limits: {
        dailySpendingLimit: 50000, // 仮の値
        monthlySpendingLimit: 500000, // 仮の値
        maxBalance: 1000000, // 仮の値
      },
    };

    return ok(balanceState);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "残高状態取得中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 残高制限をチェックする
 * @param currentAmount 現在金額
 * @param additionalAmount 追加金額
 * @param limitAmount 制限金額
 * @param limitType 制限種別
 * @returns チェック結果
 */
export function checkBalanceLimit(
  currentAmount: number,
  additionalAmount: number,
  limitAmount: number,
  limitType: "daily" | "monthly" | "transaction",
): Result<boolean, BusinessError> {
  if (currentAmount < 0 || additionalAmount < 0 || limitAmount < 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "金額は0以上である必要があります",
      reason: `無効な金額: current=${currentAmount}, additional=${additionalAmount}, limit=${limitAmount}`,
      paymentId: undefined,
    });
  }

  const newTotal = currentAmount + additionalAmount;

  if (newTotal > limitAmount) {
    return err({
      type: "TRANSACTION_LIMIT_EXCEEDED",
      message: `${limitType === "daily" ? "日次" : limitType === "monthly" ? "月次" : "取引"}制限を超えています`,
      limit: limitAmount,
      attempted: newTotal,
      limitType,
    });
  }

  return ok(true);
}

// テストコード（In Source Testing）
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("validateChargeAmount", () => {
    it("有効なチャージ金額の場合、成功を返す", () => {
      const result = validateChargeAmount(1000);
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(1000);
    });

    it("0以下の金額の場合、エラーを返す", () => {
      const result = validateChargeAmount(0);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("CHARGE_MINIMUM_NOT_MET");
    });

    it("最小金額未満の場合、エラーを返す", () => {
      const result = validateChargeAmount(50);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("CHARGE_MINIMUM_NOT_MET");
    });

    it("上限を超える金額の場合、エラーを返す", () => {
      const result = validateChargeAmount(2000000);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("TRANSACTION_LIMIT_EXCEEDED");
    });
  });

  describe("validateTransferAmount", () => {
    it("有効な送金金額の場合、成功を返す", () => {
      const result = validateTransferAmount(1000, 5000);
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(1000);
    });

    it("残高不足の場合、エラーを返す", () => {
      const result = validateTransferAmount(5000, 3000);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("INSUFFICIENT_BALANCE");
    });

    it("上限を超える金額の場合、エラーを返す", () => {
      const result = validateTransferAmount(200000, 300000);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("TRANSACTION_LIMIT_EXCEEDED");
    });
  });

  describe("validateTransferRecipient", () => {
    it("有効な送金先の場合、成功を返す", () => {
      const result = validateTransferRecipient("user_123", "user_456");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe("user_123");
    });

    it("自分自身への送金の場合、エラーを返す", () => {
      const result = validateTransferRecipient("user_123", "user_123");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("TRANSFER_TO_SELF");
    });

    it("空の送金先IDの場合、エラーを返す", () => {
      const result = validateTransferRecipient("", "user_456");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("calculateTotalBalance", () => {
    it("通常残高とキャンペーン残高を正しく計算する", () => {
      const campaignBalances: CampaignBalance[] = [
        {
          id: 1,
          amount: 500,
          label: "キャンペーン1",
          expiryDate: "2025-12-31",
          daysLeft: 30,
        },
        {
          id: 2,
          amount: 300,
          label: "キャンペーン2",
          expiryDate: "2025-12-31",
          daysLeft: 60,
        },
      ];

      const result = calculateTotalBalance(1000, campaignBalances);
      expect(result.isOk()).toBe(true);

      const calculation = result._unsafeUnwrap();
      expect(calculation.totalBalance).toBe(1800);
      expect(calculation.campaignBalance).toBe(800);
      expect(calculation.breakdown.regular).toBe(1000);
    });

    it("負の通常残高の場合、エラーを返す", () => {
      const result = calculateTotalBalance(-100);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("checkSufficientBalance", () => {
    it("残高が十分な場合、適切な結果を返す", () => {
      const result = checkSufficientBalance(1000, 5000);
      expect(result.isOk()).toBe(true);

      const check = result._unsafeUnwrap();
      expect(check.hasSufficientFunds).toBe(true);
      expect(check.shortfallAmount).toBe(0);
      expect(check.suggestedChargeAmount).toBe(0);
    });

    it("残高不足の場合、不足分と推奨チャージ額を計算する", () => {
      const result = checkSufficientBalance(5000, 3000);
      expect(result.isOk()).toBe(true);

      const check = result._unsafeUnwrap();
      expect(check.hasSufficientFunds).toBe(false);
      expect(check.shortfallAmount).toBe(2000);
      expect(check.suggestedChargeAmount).toBe(3000); // 2000 + 1000のマージンを1000円単位で切り上げ
    });
  });

  describe("checkBalanceLimit", () => {
    it("制限内の場合、成功を返す", () => {
      const result = checkBalanceLimit(1000, 2000, 5000, "daily");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it("制限を超える場合、エラーを返す", () => {
      const result = checkBalanceLimit(3000, 3000, 5000, "daily");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("TRANSACTION_LIMIT_EXCEEDED");
    });
  });
}
