/**
 * Result型ユーティリティ
 *
 * このファイルは、neverthrowのResult型を扱うためのユーティリティ関数を提供します。
 * デバッグ用関数、変換関数、アダプター関数などが含まれます。
 */

import { Result, ok, err, ResultAsync } from "neverthrow";
import { AppError, ErrorContext } from "@/shared/types/errors";
import { getErrorMessage, logError, createErrorContext } from "./error-utils";

/**
 * Result型のデバッグ用ユーティリティ
 * 開発環境でResult型の値をコンソールに出力します
 *
 * @param result - デバッグ対象のResult
 * @param label - ログのラベル
 * @returns 元のResultをそのまま返す（チェーン可能）
 */
export function debugResult<T, E>(
  result: Result<T, E>,
  label: string,
): Result<T, E> {
  if (process.env.NODE_ENV === "development") {
    result.match(
      (value) => console.log(`${label} - Success:`, value),
      (error) => console.log(`${label} - Error:`, error),
    );
  }
  return result;
}

/**
 * ResultAsync型のデバッグ用ユーティリティ
 *
 * @param resultAsync - デバッグ対象のResultAsync
 * @param label - ログのラベル
 * @returns 元のResultAsyncをそのまま返す（チェーン可能）
 */
export function debugResultAsync<T, E>(
  resultAsync: ResultAsync<T, E>,
  label: string,
): ResultAsync<T, E> {
  if (process.env.NODE_ENV === "development") {
    return resultAsync
      .map((value) => {
        console.log(`${label} - Success:`, value);
        return value;
      })
      .mapErr((error) => {
        console.log(`${label} - Error:`, error);
        return error;
      });
  }
  return resultAsync;
}

/**
 * 複数のResultを組み合わせて、すべてが成功した場合のみ成功を返す
 *
 * @param results - Result型の配列
 * @returns すべて成功の場合は成功値の配列、一つでも失敗があれば最初のエラー
 */
export function combineResults<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];

  for (const result of results) {
    if (result.isErr()) {
      return err(result.error);
    }
    values.push(result.value);
  }

  return ok(values);
}

/**
 * 複数のResultを組み合わせて、すべてのエラーを収集する
 *
 * @param results - Result型の配列
 * @returns すべて成功の場合は成功値の配列、エラーがある場合はすべてのエラーの配列
 */
export function combineResultsWithAllErrors<T, E>(
  results: Result<T, E>[],
): Result<T[], E[]> {
  const values: T[] = [];
  const errors: E[] = [];

  for (const result of results) {
    if (result.isErr()) {
      errors.push(result.error);
    } else {
      values.push(result.value);
    }
  }

  return errors.length > 0 ? err(errors) : ok(values);
}

/**
 * Promise<T>をResultAsync<T, AppError>に変換
 *
 * @param promise - 変換対象のPromise
 * @param errorMapper - エラーをAppErrorに変換する関数
 * @returns ResultAsync
 */
export function fromPromise<T>(
  promise: Promise<T>,
  errorMapper: (error: unknown) => AppError,
): ResultAsync<T, AppError> {
  return ResultAsync.fromPromise(promise, errorMapper);
}

/**
 * 従来の{ isValid: boolean; reason?: string }パターンをResult型に変換するアダプター
 *
 * @param legacyResult - 従来のパターンの結果
 * @param successValue - 成功時の値
 * @param errorType - エラー時のAppError type
 * @param field - エラーが発生したフィールド名
 * @returns Result型
 */
export function fromLegacyValidation<T>(
  legacyResult: { isValid: boolean; reason?: string },
  successValue: T,
  errorType: AppError["type"] = "INVALID_FORMAT",
  field: string = "unknown",
): Result<T, AppError> {
  if (legacyResult.isValid) {
    return ok(successValue);
  }

  // エラー型に応じて適切なAppErrorを生成
  const errorMessage = legacyResult.reason || "バリデーションエラー";

  switch (errorType) {
    case "INVALID_EMAIL":
      return err({
        type: "INVALID_EMAIL",
        message: errorMessage,
        field: "email",
      });
    case "INVALID_AMOUNT":
      return err({
        type: "INVALID_AMOUNT",
        message: errorMessage,
        field: "amount",
      });
    case "REQUIRED_FIELD":
      return err({
        type: "REQUIRED_FIELD",
        message: errorMessage,
        field,
      });
    default:
      return err({
        type: "INVALID_FORMAT",
        message: errorMessage,
        field,
        expected: "valid format",
      });
  }
}

/**
 * Result型を従来の{ isValid: boolean; reason?: string }パターンに変換するアダプター
 * 段階的移行時の互換性のために使用
 *
 * @param result - Result型
 * @returns 従来のパターンの結果
 */
export function toLegacyValidation<T>(result: Result<T, AppError>): {
  isValid: boolean;
  reason?: string;
} {
  return result.match(
    () => ({ isValid: true }),
    (error) => ({ isValid: false, reason: getErrorMessage(error) }),
  );
}

/**
 * Result型をPromiseに変換（従来のasync/await互換のため）
 *
 * @param result - Result型
 * @returns Promise（エラーの場合はreject）
 */
export function toPromise<T>(result: Result<T, AppError>): Promise<T> {
  return result.match(
    (value) => Promise.resolve(value),
    (error) => Promise.reject(new Error(getErrorMessage(error))),
  );
}

/**
 * ResultAsync型をPromiseに変換
 *
 * @param resultAsync - ResultAsync型
 * @returns Promise（エラーの場合はreject）
 */
export function resultAsyncToPromise<T>(
  resultAsync: ResultAsync<T, AppError>,
): Promise<T> {
  return resultAsync.match(
    (value) => value,
    (error) => {
      throw new Error(getErrorMessage(error));
    },
  );
}

/**
 * 条件に基づいてResultを生成
 *
 * @param condition - 判定条件
 * @param successValue - 成功時の値
 * @param errorValue - 失敗時のエラー
 * @returns Result型
 */
export function fromCondition<T, E>(
  condition: boolean,
  successValue: T,
  errorValue: E,
): Result<T, E> {
  return condition ? ok(successValue) : err(errorValue);
}

/**
 * 配列の各要素にResult型を返す関数を適用し、すべて成功した場合のみ成功を返す
 *
 * @param array - 処理対象の配列
 * @param fn - 各要素に適用する関数
 * @returns Result型
 */
export function mapArrayToResult<T, U, E>(
  array: T[],
  fn: (item: T, index: number) => Result<U, E>,
): Result<U[], E> {
  const results = array.map(fn);
  return combineResults(results);
}

/**
 * Result型の値が条件を満たすかチェック
 *
 * @param result - チェック対象のResult
 * @param predicate - チェック条件
 * @param errorValue - 条件を満たさない場合のエラー
 * @returns Result型
 */
export function filterResult<T, E>(
  result: Result<T, E>,
  predicate: (value: T) => boolean,
  errorValue: E,
): Result<T, E> {
  return result.andThen((value) =>
    predicate(value) ? ok(value) : err(errorValue),
  );
}

/**
 * Result型のエラーをログ出力して元のResultを返す（副作用のみ）
 *
 * @param result - Result型
 * @param context - エラーコンテキスト
 * @returns 元のResultをそのまま返す
 */
export function logErrorAndReturn<T>(
  result: Result<T, AppError>,
  context?: Partial<ErrorContext>,
): Result<T, AppError> {
  result.mapErr((error) => {
    const fullContext = context
      ? createErrorContext(context.userId, context.transactionId, context)
      : undefined;
    logError(error, fullContext);
    return error;
  });
  return result;
}

/**
 * 複数のResult型の値を並列で処理（Promise.allのResult版）
 *
 * @param results - ResultAsync型の配列
 * @returns すべて成功した場合は成功値の配列、一つでも失敗があれば最初のエラー
 */
export function combineResultsAsync<T, E>(
  results: ResultAsync<T, E>[],
): ResultAsync<T[], E> {
  return ResultAsync.combine(results);
}

/**
 * タイムアウト付きのResultAsync実行
 *
 * @param resultAsync - 実行するResultAsync
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @param timeoutError - タイムアウト時のエラー
 * @returns Result型（タイムアウト時はエラー）
 */
export function withTimeout<T, E>(
  resultAsync: ResultAsync<T, E>,
  timeoutMs: number,
  timeoutError: E,
): ResultAsync<T, E> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(timeoutError), timeoutMs);
  });

  return ResultAsync.fromPromise(
    Promise.race([
      resultAsync.match(
        (value) => Promise.resolve(value),
        (error) => Promise.reject(error),
      ),
      timeoutPromise,
    ]),
    (error) => error as E,
  );
}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;

  describe("combineResults", () => {
    test("combines successful results", () => {
      const results = [ok(1), ok(2), ok(3)];
      const combined = combineResults(results);

      expect(combined.isOk()).toBe(true);
      expect(combined.unwrapOr([])).toEqual([1, 2, 3]);
    });

    test("returns first error when any result fails", () => {
      const results = [ok(1), err("error1"), err("error2")];
      const combined = combineResults(results);

      expect(combined.isErr()).toBe(true);
      if (combined.isErr()) {
        expect(combined.error).toBe("error1");
      }
    });
  });

  describe("fromLegacyValidation", () => {
    test("converts valid legacy result to Ok", () => {
      const legacy = { isValid: true };
      const result = fromLegacyValidation(legacy, "success");

      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr("")).toBe("success");
    });

    test("converts invalid legacy result to Err", () => {
      const legacy = { isValid: false, reason: "validation failed" };
      const result = fromLegacyValidation(
        legacy,
        "success",
        "REQUIRED_FIELD",
        "username",
      );

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("REQUIRED_FIELD");
        expect(result.error.message).toBe("validation failed");
      }
    });
  });

  describe("toLegacyValidation", () => {
    test("converts Ok result to valid legacy format", () => {
      const result = ok("success");
      const legacy = toLegacyValidation(result);

      expect(legacy.isValid).toBe(true);
      expect(legacy.reason).toBeUndefined();
    });

    test("converts Err result to invalid legacy format", () => {
      const error: AppError = {
        type: "REQUIRED_FIELD",
        message: "Field is required",
        field: "username",
      };
      const result = err(error);
      const legacy = toLegacyValidation(result);

      expect(legacy.isValid).toBe(false);
      expect(legacy.reason).toBe("usernameは必須項目です");
    });
  });

  describe("fromCondition", () => {
    test("returns Ok when condition is true", () => {
      const result = fromCondition(true, "success", "error");
      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr("")).toBe("success");
    });

    test("returns Err when condition is false", () => {
      const result = fromCondition(false, "success", "error");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });
  });

  describe("mapArrayToResult", () => {
    test("maps array successfully when all operations succeed", () => {
      const array = [1, 2, 3];
      const result = mapArrayToResult(array, (x) => ok(x * 2));

      expect(result.isOk()).toBe(true);
      expect(result.unwrapOr([])).toEqual([2, 4, 6]);
    });

    test("returns error when any operation fails", () => {
      const array = [1, 2, 3];
      const result = mapArrayToResult(array, (x) =>
        x === 2 ? err("error") : ok(x * 2),
      );

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });
  });
}
