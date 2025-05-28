import { AppError } from "../../../shared/types/errors";

// 寄付プロジェクトの型定義
export interface DonationProject {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  imageType?: "forest" | "ocean" | "mountain" | "city";
  organization: string;
  endDate: string;
  impact: {
    forestArea?: number;
    co2Reduction?: number;
    waterSaved?: number;
    beneficiaries?: number;
  };
}

// 寄付情報の型定義
export interface DonationInfo {
  projectId: string;
  amount: number;
  donorName?: string;
  message?: string;
  isAnonymous: boolean;
  paymentMethod: "balance" | "credit" | "bank";
}

// 寄付の状態（AppError型対応）
export interface DonationState {
  currentProject: DonationProject | null;
  donationAmount: number;
  step: "input" | "confirm" | "complete";
  isLoading: boolean;
  error: AppError | null;
}

// 寄付フォームのデータ
export interface DonationFormData {
  amount: number;
  donorName: string;
  message: string;
  isAnonymous: boolean;
  paymentMethod: "balance" | "credit" | "bank";
}

// 寄付完了情報
export interface DonationCompleteInfo {
  transactionId: string;
  project: DonationProject;
  amount: number;
  donatedAt: string;
  ecoImpact: {
    forestArea: number;
    co2Reduction: number;
    waterSaved: number;
  };
}
