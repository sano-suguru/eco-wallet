/**
 * トランザクション処理のビジネスロジック関数
 * Result<T, BusinessError>を使用した型安全な取引処理
 */

import { Result, ok, err } from "neverthrow";
import type { BusinessError } from "@/shared/types/errors";
import type {
  Transaction,
  TransactionType,
  EcoContribution,
} from "@/shared/types/transaction";
import type {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  FetchTransactionsParams,
  TransactionsResponse,
  TransactionStats,
} from "@/services/api/transactions";
import {
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  fetchTransactions as apiFetchTransactions,
  fetchTransactionStats as apiFetchTransactionStats,
} from "@/services/api/transactions";

/**
 * 取引作成パラメータの型定義
 */
export interface CreateTransactionParams {
  type: TransactionType;
  amount: number;
  description: string;
  ecoContribution?: {
    enabled: boolean;
    amount: number;
    project?: string;
  };
  campaignInfo?: Transaction["campaignInfo"];
  splitInfo?: Transaction["splitInfo"];
}

/**
 * 取引更新パラメータの型定義
 */
export interface UpdateTransactionParams {
  transactionId: string;
  description?: string;
  ecoContribution?: EcoContribution;
  campaignInfo?: Transaction["campaignInfo"];
  splitInfo?: Transaction["splitInfo"];
}

/**
 * 取引フィルターパラメータの型定義
 */
export interface TransactionFilterParams {
  userId?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * 取引集計結果の型定義
 */
export interface TransactionAggregation {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  breakdown: {
    byType: Record<TransactionType, number>;
    byMonth: Record<string, number>;
  };
  ecoContribution: {
    totalAmount: number;
    averagePercentage: number;
    transactionCount: number;
  };
}

/**
 * 取引バリデーション結果の型定義
 */
export interface TransactionValidationResult {
  isValid: boolean;
  validatedAmount: number;
  validatedType: TransactionType;
  issues: string[];
}

/**
 * 取引金額のバリデーション
 * @param amount 取引金額
 * @param transactionType 取引種別
 * @returns バリデーション結果
 */
export function validateTransactionAmount(
  amount: number,
  transactionType: TransactionType,
): Result<number, BusinessError> {
  if (!Number.isFinite(amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引金額が無効です",
      reason: `有限数ではない金額: ${amount}`,
      paymentId: undefined,
    });
  }

  if (transactionType === "charge" && amount <= 0) {
    return err({
      type: "CHARGE_MINIMUM_NOT_MET",
      message: "チャージ金額は0より大きい値である必要があります",
      minimum: 1,
      requested: amount,
    });
  }

  if (transactionType === "payment" && amount >= 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "決済金額は負の値である必要があります",
      reason: `決済金額が正の値: ${amount}`,
      paymentId: undefined,
    });
  }

  // 各取引タイプの上限チェック
  const limits: Record<TransactionType, number> = {
    charge: 1000000, // チャージ上限: 100万円
    payment: 500000, // 決済上限: 50万円
    receive: 100000, // 受取上限: 10万円
    donation: 50000, // 寄付上限: 5万円
    expired: 0, // 期限切れ: 0
  };

  const limit = limits[transactionType];

  if (Math.abs(amount) > limit) {
    return err({
      type: "TRANSACTION_LIMIT_EXCEEDED",
      message: `${transactionType}の金額上限を超えています（上限: ${limit.toLocaleString()}円）`,
      limit,
      attempted: Math.abs(amount),
      limitType: "transaction",
    });
  }

  if (!Number.isInteger(amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引金額は整数である必要があります",
      reason: `小数点を含む金額: ${amount}`,
      paymentId: undefined,
    });
  }

  return ok(amount);
}

/**
 * 取引種別のバリデーション
 * @param type 取引種別
 * @returns バリデーション結果
 */
export function validateTransactionType(
  type: string,
): Result<TransactionType, BusinessError> {
  const validTypes: TransactionType[] = [
    "charge",
    "payment",
    "receive",
    "donation",
    "expired",
  ];

  if (!validTypes.includes(type as TransactionType)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "無効な取引種別です",
      reason: `サポートされていない取引種別: ${type}`,
      paymentId: undefined,
    });
  }

  return ok(type as TransactionType);
}

/**
 * エコ貢献のバリデーション
 * @param ecoContribution エコ貢献情報
 * @returns バリデーション結果
 */
export function validateEcoContribution(
  ecoContribution?: CreateTransactionParams["ecoContribution"],
): Result<EcoContribution | undefined, BusinessError> {
  if (!ecoContribution || !ecoContribution.enabled) {
    return ok(undefined);
  }

  if (ecoContribution.amount < 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "エコ貢献金額は0以上である必要があります",
      reason: `無効な金額: ${ecoContribution.amount}`,
      paymentId: undefined,
    });
  }

  if (!Number.isInteger(ecoContribution.amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "エコ貢献金額は整数である必要があります",
      reason: `小数点を含む金額: ${ecoContribution.amount}`,
      paymentId: undefined,
    });
  }

  const validatedEcoContribution: EcoContribution = {
    enabled: true,
    amount: ecoContribution.amount,
    project: ecoContribution.project,
  };

  return ok(validatedEcoContribution);
}

/**
 * 取引作成パラメータのバリデーション
 * @param params 取引作成パラメータ
 * @returns バリデーション結果
 */
export function validateCreateTransactionParams(
  params: CreateTransactionParams,
): Result<TransactionValidationResult, BusinessError> {
  const issues: string[] = [];

  // 取引種別のバリデーション
  const typeResult = validateTransactionType(params.type);
  if (typeResult.isErr()) {
    return err(typeResult.error);
  }

  // 金額のバリデーション
  const amountResult = validateTransactionAmount(params.amount, params.type);
  if (amountResult.isErr()) {
    return err(amountResult.error);
  }

  // 説明文のバリデーション
  if (!params.description || params.description.trim().length === 0) {
    issues.push("取引説明は必須です");
  } else if (params.description.length > 100) {
    issues.push("取引説明は100文字以内である必要があります");
  }

  // エコ貢献のバリデーション
  const ecoResult = validateEcoContribution(params.ecoContribution);
  if (ecoResult.isErr()) {
    return err(ecoResult.error);
  }

  if (issues.length > 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "バリデーションエラー",
      reason: issues.join(", "),
      paymentId: undefined,
    });
  }

  const result: TransactionValidationResult = {
    isValid: true,
    validatedAmount: amountResult.value,
    validatedType: typeResult.value,
    issues: [],
  };

  return ok(result);
}

/**
 * 取引を作成する
 * @param params 取引作成パラメータ
 * @returns 作成された取引
 */
export async function createTransaction(
  params: CreateTransactionParams,
): Promise<Result<Transaction, BusinessError>> {
  // バリデーション実行
  const validationResult = validateCreateTransactionParams(params);
  if (validationResult.isErr()) {
    return err(validationResult.error);
  }

  // エコ貢献のバリデーション
  const ecoResult = validateEcoContribution(params.ecoContribution);
  if (ecoResult.isErr()) {
    return err(ecoResult.error);
  }

  try {
    // API呼び出し用のリクエスト作成
    const createRequest: CreateTransactionRequest = {
      type: params.type,
      amount: params.amount,
      description: params.description,
      ecoContribution: ecoResult.value,
      campaignInfo: params.campaignInfo,
      splitInfo: params.splitInfo,
    };

    // API呼び出し
    const apiResult = await apiCreateTransaction(createRequest);

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引作成に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: undefined,
      });
    }

    return ok(apiResult.value);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引作成中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 取引を更新する
 * @param params 取引更新パラメータ
 * @returns 更新された取引
 */
export async function updateTransaction(
  params: UpdateTransactionParams,
): Promise<Result<Transaction, BusinessError>> {
  if (!params.transactionId || params.transactionId.trim().length === 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引IDが無効です",
      reason: `空の取引ID: ${params.transactionId}`,
      paymentId: params.transactionId,
    });
  }

  // 説明文のバリデーション
  if (params.description !== undefined && params.description.length > 100) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引説明は100文字以内である必要があります",
      reason: `説明文が長すぎます: ${params.description.length}文字`,
      paymentId: params.transactionId,
    });
  }

  try {
    // API呼び出し用のリクエスト作成
    const updateRequest: UpdateTransactionRequest = {
      description: params.description,
      ecoContribution: params.ecoContribution,
      campaignInfo: params.campaignInfo,
      splitInfo: params.splitInfo,
    };

    // API呼び出し
    const apiResult = await apiUpdateTransaction(
      params.transactionId,
      updateRequest,
    );

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引更新に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: params.transactionId,
      });
    }

    return ok(apiResult.value);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引更新中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: params.transactionId,
    });
  }
}

/**
 * 取引を削除する
 * @param transactionId 取引ID
 * @returns 削除結果
 */
export async function deleteTransaction(
  transactionId: string,
): Promise<Result<void, BusinessError>> {
  if (!transactionId || transactionId.trim().length === 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引IDが無効です",
      reason: `空の取引ID: ${transactionId}`,
      paymentId: transactionId,
    });
  }

  try {
    const apiResult = await apiDeleteTransaction(transactionId);

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引削除に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: transactionId,
      });
    }

    return ok(undefined);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引削除中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: transactionId,
    });
  }
}

/**
 * 取引一覧を取得する
 * @param params フィルターパラメータ
 * @returns 取引一覧
 */
export async function getTransactions(
  params: TransactionFilterParams = {},
): Promise<Result<TransactionsResponse, BusinessError>> {
  try {
    // API呼び出し用のパラメータ作成
    const fetchParams: FetchTransactionsParams = {
      userId: params.userId,
      type: params.type,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      limit: params.limit || 20,
      offset: params.offset || 0,
    };

    const apiResult = await apiFetchTransactions(fetchParams);

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引一覧の取得に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: undefined,
      });
    }

    return ok(apiResult.value);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引一覧取得中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 取引統計を取得する
 * @param userId ユーザーID
 * @param period 期間
 * @returns 取引統計
 */
export async function getTransactionStats(
  userId?: string,
  period: "month" | "year" = "month",
): Promise<Result<TransactionStats, BusinessError>> {
  try {
    const apiResult = await apiFetchTransactionStats(userId, period);

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "取引統計の取得に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: undefined,
      });
    }

    return ok(apiResult.value);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引統計取得中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 取引集計を計算する
 * @param transactions 取引の配列
 * @returns 集計結果
 */
export function aggregateTransactions(
  transactions: Transaction[],
): Result<TransactionAggregation, BusinessError> {
  if (!Array.isArray(transactions)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引データが無効です",
      reason: "配列ではない取引データ",
      paymentId: undefined,
    });
  }

  try {
    const totalAmount = transactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );
    const transactionCount = transactions.length;
    const averageAmount =
      transactionCount > 0 ? totalAmount / transactionCount : 0;

    // 種別別集計
    const byType: Record<TransactionType, number> = {
      charge: 0,
      payment: 0,
      receive: 0,
      donation: 0,
      expired: 0,
    };

    // 月別集計
    const byMonth: Record<string, number> = {};

    // エコ貢献集計
    let ecoContributionTotal = 0;
    let ecoContributionCount = 0;

    transactions.forEach((transaction) => {
      // 種別別
      byType[transaction.type] += Math.abs(transaction.amount);

      // 月別
      const month = transaction.date.substring(0, 7); // YYYY-MM形式
      byMonth[month] = (byMonth[month] || 0) + Math.abs(transaction.amount);

      // エコ貢献
      if (
        transaction.ecoContribution?.enabled &&
        transaction.ecoContribution.amount
      ) {
        ecoContributionTotal += transaction.ecoContribution.amount;
        ecoContributionCount++;
      }
    });

    const averageEcoPercentage =
      ecoContributionCount > 0 ? (ecoContributionTotal / totalAmount) * 100 : 0;

    const result: TransactionAggregation = {
      totalAmount,
      transactionCount,
      averageAmount,
      breakdown: {
        byType,
        byMonth,
      },
      ecoContribution: {
        totalAmount: ecoContributionTotal,
        averagePercentage: averageEcoPercentage,
        transactionCount: ecoContributionCount,
      },
    };

    return ok(result);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引集計中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 取引の重複をチェックする
 * @param newTransaction 新しい取引
 * @param existingTransactions 既存の取引一覧
 * @param timeWindowMinutes 重複判定の時間窓（分）
 * @returns 重複チェック結果
 */
export function checkTransactionDuplicate(
  newTransaction: CreateTransactionParams,
  existingTransactions: Transaction[],
  timeWindowMinutes: number = 5,
): Result<
  { isDuplicate: boolean; duplicateTransaction?: Transaction },
  BusinessError
> {
  if (timeWindowMinutes <= 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "時間窓は0より大きい値である必要があります",
      reason: `無効な時間窓: ${timeWindowMinutes}`,
      paymentId: undefined,
    });
  }

  try {
    const now = new Date();
    const timeWindow = timeWindowMinutes * 60 * 1000; // ミリ秒に変換

    const duplicate = existingTransactions.find((existing) => {
      // 同じ種別・金額・説明の取引を検索
      if (
        existing.type !== newTransaction.type ||
        existing.amount !== newTransaction.amount ||
        existing.description !== newTransaction.description
      ) {
        return false;
      }

      // 時間窓内の取引かチェック
      const existingTime = new Date(existing.date);
      const timeDiff = Math.abs(now.getTime() - existingTime.getTime());

      return timeDiff <= timeWindow;
    });

    return ok({
      isDuplicate: !!duplicate,
      duplicateTransaction: duplicate,
    });
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "重複チェック中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

// テストコード（In Source Testing）
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("validateTransactionAmount", () => {
    it("有効なチャージ金額の場合、成功を返す", () => {
      const result = validateTransactionAmount(1000, "charge");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(1000);
    });

    it("チャージで0以下の金額の場合、エラーを返す", () => {
      const result = validateTransactionAmount(0, "charge");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("CHARGE_MINIMUM_NOT_MET");
    });

    it("上限を超える金額の場合、エラーを返す", () => {
      const result = validateTransactionAmount(2000000, "charge");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("TRANSACTION_LIMIT_EXCEEDED");
    });

    it("小数点の金額の場合、エラーを返す", () => {
      const result = validateTransactionAmount(100.5, "payment");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("validateTransactionType", () => {
    it("有効な取引種別の場合、成功を返す", () => {
      const result = validateTransactionType("payment");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe("payment");
    });

    it("無効な取引種別の場合、エラーを返す", () => {
      const result = validateTransactionType("invalid_type");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("validateCreateTransactionParams", () => {
    it("有効なパラメータの場合、成功を返す", () => {
      const params: CreateTransactionParams = {
        type: "payment",
        amount: -1000,
        description: "テスト決済",
      };
      const result = validateCreateTransactionParams(params);
      expect(result.isOk()).toBe(true);

      const validation = result._unsafeUnwrap();
      expect(validation.isValid).toBe(true);
      expect(validation.validatedAmount).toBe(-1000);
      expect(validation.validatedType).toBe("payment");
    });

    it("説明文が長すぎる場合、エラーを返す", () => {
      const params: CreateTransactionParams = {
        type: "payment",
        amount: -1000,
        description: "a".repeat(101), // 101文字
      };
      const result = validateCreateTransactionParams(params);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("aggregateTransactions", () => {
    it("取引を正しく集計する", () => {
      const transactions: Transaction[] = [
        {
          id: "txn_1",
          type: "payment",
          amount: -1000,
          description: "テスト1",
          date: "2025-01-15T10:00:00Z",
        },
        {
          id: "txn_2",
          type: "charge",
          amount: 2000,
          description: "テスト2",
          date: "2025-01-16T10:00:00Z",
        },
      ];

      const result = aggregateTransactions(transactions);
      expect(result.isOk()).toBe(true);

      const aggregation = result._unsafeUnwrap();
      expect(aggregation.totalAmount).toBe(3000);
      expect(aggregation.transactionCount).toBe(2);
      expect(aggregation.averageAmount).toBe(1500);
      expect(aggregation.breakdown.byType.payment).toBe(1000);
      expect(aggregation.breakdown.byType.charge).toBe(2000);
    });

    it("空の配列の場合、適切な結果を返す", () => {
      const result = aggregateTransactions([]);
      expect(result.isOk()).toBe(true);

      const aggregation = result._unsafeUnwrap();
      expect(aggregation.totalAmount).toBe(0);
      expect(aggregation.transactionCount).toBe(0);
      expect(aggregation.averageAmount).toBe(0);
    });
  });

  describe("checkTransactionDuplicate", () => {
    it("重複なしの場合、適切な結果を返す", () => {
      const newTransaction: CreateTransactionParams = {
        type: "payment",
        amount: -1000,
        description: "テスト決済",
      };

      const existingTransactions: Transaction[] = [
        {
          id: "txn_1",
          type: "charge",
          amount: 2000,
          description: "別の取引",
          date: new Date().toISOString(),
        },
      ];

      const result = checkTransactionDuplicate(
        newTransaction,
        existingTransactions,
      );
      expect(result.isOk()).toBe(true);

      const check = result._unsafeUnwrap();
      expect(check.isDuplicate).toBe(false);
      expect(check.duplicateTransaction).toBeUndefined();
    });
  });
}
