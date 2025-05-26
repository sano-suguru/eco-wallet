/**
 * 環境貢献計算のビジネスロジック関数
 * Result<T, BusinessError>を使用した型安全な環境貢献処理
 */

import { Result, ok, err } from "neverthrow";
import type { BusinessError } from "@/shared/types/errors";
import type {
  EcoRank,
  ContributionParams,
  EcoState,
  EcoImpact,
} from "@/lib/utils/eco/types";
import {
  determineEcoRank,
  calculateEcoImpact,
  calculateContribution,
  calculateEcoProgress,
} from "@/lib/utils/eco/calculations";

/**
 * 拡張環境貢献パラメータの型定義
 */
export interface ExtendedContributionParams extends ContributionParams {
  userId?: string;
  projectId?: string;
  category?: "forest" | "ocean" | "energy" | "waste" | "carbon";
  description?: string;
}

/**
 * 環境貢献計算結果の型定義
 */
export interface EcoContributionResult {
  impact: EcoImpact;
  newState: Partial<EcoState>;
  rank: EcoRank;
  progress: number;
  achievements: string[];
  nextMilestone: {
    amount: number;
    rank: EcoRank;
    description: string;
  };
}

/**
 * 環境貢献集計結果の型定義
 */
export interface EcoContributionSummary {
  totalContribution: number;
  totalImpact: EcoImpact;
  contributionsByCategory: Record<string, number>;
  contributionsByProject: Record<string, number>;
  currentRank: EcoRank;
  nextRankThreshold: number;
  averageContributionPerTransaction: number;
  contributionStreak: number;
}

/**
 * 環境貢献の有効性チェック結果
 */
export interface EcoContributionValidation {
  isValid: boolean;
  validatedAmount: number;
  validatedCategory: string;
  warnings: string[];
  suggestions: string[];
}

/**
 * 環境貢献金額のバリデーション
 * @param amount 貢献金額
 * @returns バリデーション結果
 */
export function validateEcoContributionAmount(
  amount: number,
): Result<number, BusinessError> {
  if (amount < 0) {
    return err({
      type: "DONATION_LIMIT_EXCEEDED",
      message: "環境貢献金額は0以上である必要があります",
      maxDonationAmount: 0,
      requestedAmount: amount,
    });
  }

  if (amount > 50000) {
    return err({
      type: "DONATION_LIMIT_EXCEEDED",
      message: "環境貢献金額が上限を超えています（上限: 50,000円）",
      maxDonationAmount: 50000,
      requestedAmount: amount,
    });
  }

  if (!Number.isInteger(amount)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献金額は整数である必要があります",
      reason: `小数点を含む金額: ${amount}`,
      paymentId: undefined,
    });
  }

  return ok(amount);
}

/**
 * 環境貢献カテゴリのバリデーション
 * @param category 貢献カテゴリ
 * @returns バリデーション結果
 */
export function validateEcoContributionCategory(
  category?: string,
): Result<"forest" | "ocean" | "energy" | "waste" | "carbon", BusinessError> {
  if (!category) {
    return ok("forest"); // デフォルトは森林保全
  }

  const validCategories = [
    "forest",
    "ocean",
    "energy",
    "waste",
    "carbon",
  ] as const;

  if (
    !validCategories.includes(
      category as "forest" | "ocean" | "energy" | "waste" | "carbon",
    )
  ) {
    return err({
      type: "PAYMENT_FAILED",
      message: "無効な環境貢献カテゴリです",
      reason: `サポートされていないカテゴリ: ${category}`,
      paymentId: undefined,
    });
  }

  return ok(category as "forest" | "ocean" | "energy" | "waste" | "carbon");
}

/**
 * 環境貢献パラメータのバリデーション
 * @param params 環境貢献パラメータ
 * @returns バリデーション結果
 */
export function validateEcoContributionParams(
  params: ExtendedContributionParams,
): Result<EcoContributionValidation, BusinessError> {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // 金額のバリデーション
  const amountResult = validateEcoContributionAmount(params.amount);
  if (amountResult.isErr()) {
    return err(amountResult.error);
  }

  // カテゴリのバリデーション
  const categoryResult = validateEcoContributionCategory(params.category);
  if (categoryResult.isErr()) {
    return err(categoryResult.error);
  }

  // 金額に基づく警告とアドバイス
  if (params.amount < 100) {
    warnings.push("少額の貢献でも環境に良い影響を与えます");
  }

  if (params.amount >= 1000) {
    suggestions.push(
      "大きな貢献をありがとうございます！SNSでシェアしませんか？",
    );
  }

  // 説明文のバリデーション
  if (params.description && params.description.length > 200) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献の説明は200文字以内である必要があります",
      reason: `説明文が長すぎます: ${params.description.length}文字`,
      paymentId: undefined,
    });
  }

  const result: EcoContributionValidation = {
    isValid: true,
    validatedAmount: amountResult.value,
    validatedCategory: categoryResult.value ?? "forest",
    warnings,
    suggestions,
  };

  return ok(result);
}

/**
 * 環境貢献を計算する（Result版）
 * @param currentState 現在の環境貢献状態
 * @param params 貢献パラメータ
 * @returns 計算結果
 */
export function calculateEcoContributionSafe(
  currentState: EcoState,
  params: ExtendedContributionParams,
): Result<EcoContributionResult, BusinessError> {
  // パラメータのバリデーション
  const validationResult = validateEcoContributionParams(params);
  if (validationResult.isErr()) {
    return err(validationResult.error);
  }

  try {
    // 既存の計算関数を使用
    const impact = calculateEcoImpact(params.amount);
    const newState = calculateContribution(currentState, params);

    // 新しい合計寄付額からランクを計算
    const newTotalDonation = newState.totalDonation || 0;
    const rank = determineEcoRank(newTotalDonation);

    // 進捗率の計算（仮の目標値を使用）
    const targetForestArea = 100; // 100m²
    const targetWaterSaved = 50000; // 50,000L
    const targetCo2Reduction = 1000; // 1,000kg

    const progress = calculateEcoProgress(
      newState.forestArea || 0,
      newState.waterSaved || 0,
      newState.co2Reduction || 0,
      targetForestArea,
      targetWaterSaved,
      targetCo2Reduction,
    );

    // 成果の判定
    const achievements: string[] = [];
    if (impact.forestArea >= 1) {
      achievements.push(`森林保全: ${impact.forestArea}m²貢献`);
    }
    if (impact.waterSaved >= 100) {
      achievements.push(`水資源保護: ${impact.waterSaved}L節約`);
    }
    if (impact.co2Reduction >= 1) {
      achievements.push(`CO₂削減: ${impact.co2Reduction}kg削減`);
    }

    // 次のマイルストーンの計算
    const nextMilestone = calculateNextMilestone(newTotalDonation, rank);

    const result: EcoContributionResult = {
      impact,
      newState,
      rank,
      progress,
      achievements,
      nextMilestone,
    };

    return ok(result);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献計算中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 次のマイルストーンを計算する
 * @param currentDonation 現在の寄付総額
 * @param currentRank 現在のランク
 * @returns 次のマイルストーン情報
 */
export function calculateNextMilestone(
  currentDonation: number,
  _currentRank: EcoRank, // eslint-disable-line @typescript-eslint/no-unused-vars
): { amount: number; rank: EcoRank; description: string } {
  const milestones = [
    {
      threshold: 5000,
      rank: "エコサポーター" as EcoRank,
      description: "継続的な環境貢献者",
    },
    {
      threshold: 20000,
      rank: "エコマイスター" as EcoRank,
      description: "環境保全のリーダー",
    },
    {
      threshold: 50000,
      rank: "エコチャンピオン" as EcoRank,
      description: "環境保全の先駆者",
    },
  ];

  const nextMilestone = milestones.find(
    (milestone) => currentDonation < milestone.threshold,
  );

  if (nextMilestone) {
    return {
      amount: nextMilestone.threshold - currentDonation,
      rank: nextMilestone.rank,
      description: nextMilestone.description,
    };
  }

  // 最高ランクに到達済み
  return {
    amount: 0,
    rank: "エコチャンピオン",
    description: "最高ランク達成済み",
  };
}

/**
 * 環境貢献の集計を計算する
 * @param contributions 貢献履歴の配列
 * @returns 集計結果
 */
export function aggregateEcoContributions(
  contributions: ExtendedContributionParams[],
): Result<EcoContributionSummary, BusinessError> {
  if (!Array.isArray(contributions)) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献データが無効です",
      reason: "配列ではない貢献データ",
      paymentId: undefined,
    });
  }

  try {
    const totalContribution = contributions.reduce(
      (sum, c) => sum + c.amount,
      0,
    );
    const contributionCount = contributions.length;

    // 総合インパクトの計算
    const totalImpact = contributions.reduce(
      (acc, contribution) => {
        const impact = calculateEcoImpact(contribution.amount);
        return {
          forestArea: acc.forestArea + impact.forestArea,
          waterSaved: acc.waterSaved + impact.waterSaved,
          co2Reduction: acc.co2Reduction + impact.co2Reduction,
        };
      },
      { forestArea: 0, waterSaved: 0, co2Reduction: 0 },
    );

    // カテゴリ別集計
    const contributionsByCategory: Record<string, number> = {};
    contributions.forEach((contribution) => {
      const category = contribution.category || "forest";
      contributionsByCategory[category] =
        (contributionsByCategory[category] || 0) + contribution.amount;
    });

    // プロジェクト別集計
    const contributionsByProject: Record<string, number> = {};
    contributions.forEach((contribution) => {
      if (contribution.projectId) {
        contributionsByProject[contribution.projectId] =
          (contributionsByProject[contribution.projectId] || 0) +
          contribution.amount;
      }
    });

    // 現在のランクと次のランクまでの金額
    const currentRank = determineEcoRank(totalContribution);
    const nextRankThreshold = calculateNextMilestone(
      totalContribution,
      currentRank,
    ).amount;

    // 平均貢献額
    const averageContributionPerTransaction =
      contributionCount > 0 ? totalContribution / contributionCount : 0;

    // 貢献ストリーク（連続貢献日数の簡易計算）
    const contributionStreak = Math.min(contributionCount, 30); // 最大30日

    const result: EcoContributionSummary = {
      totalContribution,
      totalImpact,
      contributionsByCategory,
      contributionsByProject,
      currentRank,
      nextRankThreshold,
      averageContributionPerTransaction,
      contributionStreak,
    };

    return ok(result);
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献集計中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 環境貢献の効率性を計算する
 * @param amount 貢献金額
 * @param category 貢献カテゴリ
 * @returns 効率性情報
 */
export function calculateEcoEfficiency(
  amount: number,
  category: ExtendedContributionParams["category"] = "forest",
): Result<
  { efficiency: number; description: string; comparison: string },
  BusinessError
> {
  const amountValidation = validateEcoContributionAmount(amount);
  if (amountValidation.isErr()) {
    return err(amountValidation.error);
  }

  const categoryValidation = validateEcoContributionCategory(category);
  if (categoryValidation.isErr()) {
    return err(categoryValidation.error);
  }

  try {
    const impact = calculateEcoImpact(amount);

    // カテゴリ別の効率性計算
    let efficiency = 0;
    let description = "";
    let comparison = "";

    switch (category) {
      case "forest":
        efficiency = (impact.forestArea / amount) * 1000; // 1000円あたりのm²
        description = `森林保全: ${impact.forestArea}m²の森林を保護`;
        comparison = `一般的な植樹活動の${Math.round(efficiency * 100)}%の効率`;
        break;
      case "ocean":
        efficiency = impact.waterSaved / amount; // 1円あたりのL
        description = `海洋保護: ${impact.waterSaved}Lの水を浄化`;
        comparison = `一般的な海洋清掃の${Math.round(efficiency * 50)}%の効率`;
        break;
      case "energy":
        efficiency = (impact.co2Reduction / amount) * 100; // 100円あたりのkg
        description = `再生エネルギー: ${impact.co2Reduction}kgのCO₂削減`;
        comparison = `太陽光発電の${Math.round(efficiency * 80)}%の効率`;
        break;
      case "waste":
        efficiency = (impact.co2Reduction / amount) * 200; // 削減量ベース
        description = `廃棄物削減: ${impact.co2Reduction}kg相当の廃棄物削減`;
        comparison = `リサイクル活動の${Math.round(efficiency * 60)}%の効率`;
        break;
      case "carbon":
        efficiency = (impact.co2Reduction / amount) * 1000; // 1000円あたりのkg
        description = `炭素オフセット: ${impact.co2Reduction}kgのCO₂を削減`;
        comparison = `カーボンクレジットの${Math.round(efficiency * 120)}%の効率`;
        break;
    }

    return ok({
      efficiency: Math.round(efficiency * 100) / 100, // 小数点2桁
      description,
      comparison,
    });
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献効率性計算中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

/**
 * 環境貢献レポートを生成する
 * @param state 環境貢献状態
 * @param period 期間（月・年単位）
 * @returns レポート
 */
export function generateEcoContributionReport(
  state: EcoState,
  period: "month" | "year" = "month",
): Result<
  {
    summary: string;
    achievements: string[];
    recommendations: string[];
    nextGoals: string[];
  },
  BusinessError
> {
  try {
    const rank = determineEcoRank(state.totalDonation);
    const periodLabel = period === "month" ? "今月" : "今年";

    // サマリーの生成
    const summary = `${periodLabel}の環境貢献: ${state.monthlyDonation.toLocaleString()}円
現在のランク: ${rank}
森林保全: ${state.forestArea}m²
水資源保護: ${state.waterSaved.toLocaleString()}L
CO₂削減: ${state.co2Reduction}kg`;

    // 成果の生成
    const achievements: string[] = [];
    if (state.forestArea >= 10) {
      achievements.push(`大きな森林保全貢献: ${state.forestArea}m²`);
    }
    if (state.waterSaved >= 10000) {
      achievements.push(`水資源保護: ${state.waterSaved.toLocaleString()}L`);
    }
    if (state.co2Reduction >= 100) {
      achievements.push(`大きなCO₂削減: ${state.co2Reduction}kg`);
    }

    // レコメンデーションの生成
    const recommendations: string[] = [];
    if (state.monthlyDonation < 1000) {
      recommendations.push("月1,000円の貢献で年間12m²の森林保全が可能です");
    }
    if (rank === "エコビギナー") {
      recommendations.push(
        "継続的な貢献で「エコサポーター」ランクを目指しましょう",
      );
    }

    // 次の目標の生成
    const nextGoals: string[] = [];
    const nextMilestone = calculateNextMilestone(state.totalDonation, rank);
    if (nextMilestone.amount > 0) {
      nextGoals.push(
        `${nextMilestone.rank}まであと${nextMilestone.amount.toLocaleString()}円`,
      );
    }
    nextGoals.push(
      `${period === "month" ? "来月" : "来年"}は${Math.round(state.monthlyDonation * 1.2).toLocaleString()}円の貢献を目標にしませんか？`,
    );

    return ok({
      summary,
      achievements,
      recommendations,
      nextGoals,
    });
  } catch (error) {
    return err({
      type: "PAYMENT_FAILED",
      message: "環境貢献レポート生成中にエラーが発生しました",
      reason: String(error),
      paymentId: undefined,
    });
  }
}

// テストコード（In Source Testing）
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("validateEcoContributionAmount", () => {
    it("有効な金額の場合、成功を返す", () => {
      const result = validateEcoContributionAmount(1000);
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(1000);
    });

    it("負の金額の場合、エラーを返す", () => {
      const result = validateEcoContributionAmount(-100);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("DONATION_LIMIT_EXCEEDED");
    });

    it("上限を超える金額の場合、エラーを返す", () => {
      const result = validateEcoContributionAmount(60000);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("DONATION_LIMIT_EXCEEDED");
    });

    it("小数点の金額の場合、エラーを返す", () => {
      const result = validateEcoContributionAmount(100.5);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });
  });

  describe("validateEcoContributionCategory", () => {
    it("有効なカテゴリの場合、成功を返す", () => {
      const result = validateEcoContributionCategory("forest");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe("forest");
    });

    it("無効なカテゴリの場合、エラーを返す", () => {
      const result = validateEcoContributionCategory("invalid_category");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().type).toBe("PAYMENT_FAILED");
    });

    it("未定義の場合、デフォルト値を返す", () => {
      const result = validateEcoContributionCategory();
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe("forest");
    });
  });

  describe("calculateEcoContributionSafe", () => {
    it("有効なパラメータで正しく計算する", () => {
      const currentState: EcoState = {
        forestArea: 5,
        waterSaved: 1000,
        co2Reduction: 50,
        totalDonation: 2000,
        monthlyDonation: 500,
      };

      const params: ExtendedContributionParams = {
        amount: 1000,
        category: "forest",
      };

      const result = calculateEcoContributionSafe(currentState, params);
      expect(result.isOk()).toBe(true);

      const calculation = result._unsafeUnwrap();
      expect(calculation.impact.forestArea).toBe(0.5); // 1000円 * 0.0005
      expect(calculation.rank).toBe("エコビギナー"); // 3000円未満
    });
  });

  describe("aggregateEcoContributions", () => {
    it("貢献を正しく集計する", () => {
      const contributions: ExtendedContributionParams[] = [
        { amount: 1000, category: "forest" },
        { amount: 500, category: "ocean" },
        { amount: 1500, category: "forest" },
      ];

      const result = aggregateEcoContributions(contributions);
      expect(result.isOk()).toBe(true);

      const summary = result._unsafeUnwrap();
      expect(summary.totalContribution).toBe(3000);
      expect(summary.contributionsByCategory.forest).toBe(2500);
      expect(summary.contributionsByCategory.ocean).toBe(500);
      expect(summary.averageContributionPerTransaction).toBe(1000);
    });

    it("空の配列の場合、適切な結果を返す", () => {
      const result = aggregateEcoContributions([]);
      expect(result.isOk()).toBe(true);

      const summary = result._unsafeUnwrap();
      expect(summary.totalContribution).toBe(0);
      expect(summary.averageContributionPerTransaction).toBe(0);
    });
  });

  describe("calculateEcoEfficiency", () => {
    it("森林カテゴリの効率性を正しく計算する", () => {
      const result = calculateEcoEfficiency(1000, "forest");
      expect(result.isOk()).toBe(true);

      const efficiency = result._unsafeUnwrap();
      expect(efficiency.efficiency).toBe(0.5); // 1000円で0.5m²
      expect(efficiency.description).toContain("森林保全");
    });

    it("海洋カテゴリの効率性を正しく計算する", () => {
      const result = calculateEcoEfficiency(1000, "ocean");
      expect(result.isOk()).toBe(true);

      const efficiency = result._unsafeUnwrap();
      expect(efficiency.description).toContain("海洋保護");
    });
  });

  describe("calculateNextMilestone", () => {
    it("次のマイルストーンを正しく計算する", () => {
      const milestone = calculateNextMilestone(3000, "エコビギナー");
      expect(milestone.amount).toBe(2000); // 5000 - 3000
      expect(milestone.rank).toBe("エコサポーター");
    });

    it("最高ランクの場合、適切な結果を返す", () => {
      const milestone = calculateNextMilestone(60000, "エコチャンピオン");
      expect(milestone.amount).toBe(0);
      expect(milestone.rank).toBe("エコチャンピオン");
    });
  });
}
