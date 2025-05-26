/**
 * 決済処理のビジネスロジック関数
 * Result<T, BusinessError>を使用した型安全な決済処理
 */

import { Result, ok, err } from "neverthrow";
import type { BusinessError } from "@/shared/types/errors";
import type { PaymentRequest } from "@/services/api/balance";
import {
  processPayment as apiProcessPayment,
  checkPaymentStatus as apiCheckPaymentStatus,
} from "@/services/api/balance";

/**
 * 決済情報の型定義
 */
export interface PaymentValidationResult {
  isValid: boolean;
  amount: number;
  method: string;
  currency: string;
}

/**
 * 決済実行パラメータ
 */
export interface ProcessPaymentParams {
  amount: number;
  paymentMethod: "bank_transfer" | "credit_card" | "convenience_store" | "atm";
  description?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 決済状態の型定義
 */
export interface PaymentState {
  transactionId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  method: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * 決済金額のバリデーション
 * @param amount 決済金額
 * @returns バリデーション結果
 */
export function validatePaymentAmount(
  amount: number,
): Result<number, BusinessError> {
  if (amount <= 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "決済金額は0より大きい値である必要があります",
      reason: `無効な金額: ${amount}`,
      paymentId: undefined,
    });
  }

  if (amount > 1000000) {
    return err({
      type: "TRANSACTION_LIMIT_EXCEEDED",
      message: "決済金額が上限を超えています（上限: 1,000,000円）",
      limit: 1000000,
      attempted: amount,
      limitType: "transaction",
    });
  }

  if (!Number.isInteger(amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "決済金額は整数である必要があります",
      reason: `小数点を含む金額: ${amount}`,
      paymentId: undefined,
    });
  }

  return ok(amount);
}

/**
 * 決済方法のバリデーション
 * @param method 決済方法
 * @returns バリデーション結果
 */
export function validatePaymentMethod(
  method: string,
): Result<ProcessPaymentParams["paymentMethod"], BusinessError> {
  const validMethods = [
    "bank_transfer",
    "credit_card",
    "convenience_store",
    "atm",
  ] as const;

  if (!validMethods.includes(method as ProcessPaymentParams["paymentMethod"])) {
    return err({
      type: "PAYMENT_FAILED",
      message: "無効な決済方法です",
      reason: `サポートされていない決済方法: ${method}`,
      paymentId: undefined,
    });
  }

  return ok(method as ProcessPaymentParams["paymentMethod"]);
}

/**
 * 決済パラメータの包括的バリデーション
 * @param params 決済パラメータ
 * @returns バリデーション結果
 */
export function validatePaymentParams(
  params: ProcessPaymentParams,
): Result<PaymentValidationResult, BusinessError> {
  // 金額のバリデーション
  const amountResult = validatePaymentAmount(params.amount);
  if (amountResult.isErr()) {
    return err(amountResult.error);
  }

  // 決済方法のバリデーション
  const methodResult = validatePaymentMethod(params.paymentMethod);
  if (methodResult.isErr()) {
    return err(methodResult.error);
  }

  // 説明文のバリデーション（オプション）
  if (params.description && params.description.length > 100) {
    return err({
      type: "PAYMENT_FAILED",
      message: "決済説明文は100文字以内である必要があります",
      reason: `説明文が長すぎます: ${params.description.length}文字（上限: 100文字）`,
      paymentId: undefined,
    });
  }

  return ok({
    isValid: true,
    amount: amountResult.value,
    method: methodResult.value,
    currency: "JPY",
  });
}

/**
 * 決済を実行する
 * @param params 決済パラメータ
 * @returns 決済結果
 */
export async function processPayment(
  params: ProcessPaymentParams,
): Promise<Result<PaymentState, BusinessError>> {
  // バリデーション実行
  const validationResult = validatePaymentParams(params);
  if (validationResult.isErr()) {
    return err(validationResult.error);
  }

  try {
    // API呼び出し用のリクエスト作成
    const apiRequest: PaymentRequest = {
      amount: params.amount,
      merchantId: "default_merchant", // 仮の加盟店ID
      description: params.description || "",
      ecoContribution: {
        enabled: true,
        percentage: 5, // デフォルト5%のエコ貢献
      },
    };

    // API呼び出し
    const apiResult = await apiProcessPayment(apiRequest);

    if (apiResult.isErr()) {
      // APIエラーをBusinessErrorに変換
      return err({
        type: "PAYMENT_FAILED",
        message: "決済処理に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: undefined,
      });
    }

    const apiResponse = apiResult.value;

    // PaymentStateに変換（statusの型を調整）
    let paymentStatus: PaymentState["status"] = "pending";
    if (apiResponse.status === "success") {
      paymentStatus = "completed";
    } else if (apiResponse.status === "failed") {
      paymentStatus = "failed";
    } else if (apiResponse.status === "pending") {
      paymentStatus = "pending";
    }

    const paymentState: PaymentState = {
      transactionId: apiResponse.transactionId,
      amount: apiResponse.amount,
      status: paymentStatus,
      method: params.paymentMethod,
      createdAt: new Date(),
      completedAt: paymentStatus === "completed" ? new Date() : undefined,
    };

    return ok(paymentState);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "決済処理中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 決済状態を確認する
 * @param transactionId 取引ID
 * @returns 決済状態
 */
export async function checkPaymentState(
  transactionId: string,
): Promise<Result<PaymentState, BusinessError>> {
  if (!transactionId || transactionId.trim().length === 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引IDが無効です",
      reason: `空の取引ID: ${transactionId}`,
      paymentId: transactionId,
    });
  }

  try {
    const apiResult = await apiCheckPaymentStatus(transactionId);

    if (apiResult.isErr()) {
      return err({
        type: "PAYMENT_FAILED",
        message: "決済状態の確認に失敗しました",
        reason: "API呼び出しエラー",
        paymentId: transactionId,
      });
    }

    const apiResponse = apiResult.value;

    // PaymentStateに変換（statusの型を調整）
    let paymentStatus: PaymentState["status"] = "pending";
    if (apiResponse.status === "success") {
      paymentStatus = "completed";
    } else if (apiResponse.status === "failed") {
      paymentStatus = "failed";
    } else if (apiResponse.status === "pending") {
      paymentStatus = "pending";
    }

    const paymentState: PaymentState = {
      transactionId: apiResponse.transactionId,
      amount: apiResponse.amount,
      status: paymentStatus,
      method: "unknown", // APIレスポンスから決済方法が取得できない場合
      createdAt: new Date(), // APIレスポンスから作成日時が取得できない場合
      completedAt: paymentStatus === "completed" ? new Date() : undefined,
    };

    return ok(paymentState);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "決済状態確認中に予期しないエラーが発生しました",
      reason: String(error),
      paymentId: transactionId,
    });
  }
}

/**
 * 決済キャンセル処理
 * @param transactionId 取引ID
 * @returns キャンセル結果
 */
export function cancelPayment(
  transactionId: string,
): Result<{ transactionId: string; cancelledAt: Date }, BusinessError> {
  if (!transactionId || transactionId.trim().length === 0) {
    return err({
      type: "PAYMENT_FAILED",
      message: "取引IDが無効です",
      reason: `空の取引ID: ${transactionId}`,
      paymentId: transactionId,
    });
  }

  // 実際の実装では、API呼び出しを行う
  // 現在はモック実装
  return ok({
    transactionId,
    cancelledAt: new Date(),
  });
}

/**
 * 決済手数料を計算する
 * @param amount 決済金額
 * @param method 決済方法
 * @returns 手数料
 */
export function calculatePaymentFee(
  amount: number,
  method: ProcessPaymentParams["paymentMethod"],
): Result<number, BusinessError> {
  const amountValidation = validatePaymentAmount(amount);
  if (amountValidation.isErr()) {
    return err(amountValidation.error);
  }

  const methodValidation = validatePaymentMethod(method);
  if (methodValidation.isErr()) {
    return err(methodValidation.error);
  }

  // 決済方法別の手数料計算
  let feeRate = 0;
  switch (method) {
    case "credit_card":
      feeRate = 0.033; // 3.3%
      break;
    case "bank_transfer":
      feeRate = 0; // 無料
      break;
    case "convenience_store":
      feeRate = 0.01; // 1%
      break;
    case "atm":
      feeRate = 0.005; // 0.5%
      break;
    default:
      return err({
        type: "PAYMENT_FAILED",
        message: "不明な決済方法です",
        reason: `未対応の決済方法: ${method}`,
        paymentId: undefined,
      });
  }

  const fee = Math.floor(amount * feeRate);
  return ok(fee);
}

// テストコード（In Source Testing）
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("validatePaymentAmount", () => {
    it("有効な金額の場合、成功を返す", () => {
      const result = validatePaymentAmount(1000);
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(1000);
    });

    it("0以下の金額の場合、エラーを返す", () => {
      const result = validatePaymentAmount(0);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });

    it("上限を超える金額の場合、エラーを返す", () => {
      const result = validatePaymentAmount(2000000);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("TRANSACTION_LIMIT_EXCEEDED");
    });

    it("小数点の金額の場合、エラーを返す", () => {
      const result = validatePaymentAmount(100.5);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("validatePaymentMethod", () => {
    it("有効な決済方法の場合、成功を返す", () => {
      const result = validatePaymentMethod("credit_card");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe("credit_card");
    });

    it("無効な決済方法の場合、エラーを返す", () => {
      const result = validatePaymentMethod("invalid_method");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("validatePaymentParams", () => {
    it("有効なパラメータの場合、成功を返す", () => {
      const params: ProcessPaymentParams = {
        amount: 1000,
        paymentMethod: "credit_card",
        description: "テスト決済",
      };
      const result = validatePaymentParams(params);
      expect(result.isOk()).toBe(true);

      const validation = result._unsafeUnwrap();
      expect(validation.isValid).toBe(true);
      expect(validation.amount).toBe(1000);
      expect(validation.method).toBe("credit_card");
    });

    it("長すぎる説明文の場合、エラーを返す", () => {
      const params: ProcessPaymentParams = {
        amount: 1000,
        paymentMethod: "credit_card",
        description: "a".repeat(101), // 101文字
      };
      const result = validatePaymentParams(params);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("calculatePaymentFee", () => {
    it("クレジットカードの手数料を正しく計算する", () => {
      const result = calculatePaymentFee(1000, "credit_card");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(33); // 1000 * 0.033 = 33
    });

    it("銀行振込の手数料は0円", () => {
      const result = calculatePaymentFee(1000, "bank_transfer");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(0);
    });

    it("コンビニ決済の手数料を正しく計算する", () => {
      const result = calculatePaymentFee(1000, "convenience_store");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(10); // 1000 * 0.01 = 10
    });
  });

  describe("cancelPayment", () => {
    it("有効な取引IDの場合、キャンセル成功を返す", () => {
      const result = cancelPayment("txn_123");
      expect(result.isOk()).toBe(true);

      const cancelled = result._unsafeUnwrap();
      expect(cancelled.transactionId).toBe("txn_123");
      expect(cancelled.cancelledAt).toBeInstanceOf(Date);
    });

    it("空の取引IDの場合、エラーを返す", () => {
      const result = cancelPayment("");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });
}
