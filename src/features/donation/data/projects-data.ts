import { DonationProject } from "../types/donation";

/**
 * 寄付プロジェクトのモックデータ
 */
export const donationProjects: DonationProject[] = [
  {
    id: "project_1",
    title: "山岳環境保全プロジェクト",
    description: "登山道の整備や森林再生などを通じて山岳環境の保全を目指します",
    category: "プロジェクト",
    currentAmount: 4500,
    targetAmount: 10000,
    progressPercent: 45,
    imageType: "mountain",
    organization: "日本山岳環境保全協会",
    endDate: "2025/12/31",
    impact: {
      forestArea: 5,
      co2Reduction: 100,
      waterSaved: 50000,
      beneficiaries: 1000,
    },
  },
  {
    id: "project_2",
    title: "海洋プラスチック削減イニシアチブ",
    description:
      "海洋プラスチックの削減と海岸の清掃活動を通じて海の生態系を守ります",
    category: "プロジェクト",
    currentAmount: 7950,
    targetAmount: 15000,
    progressPercent: 53,
    imageType: "ocean",
    organization: "海洋保護基金",
    endDate: "2025/09/30",
    impact: {
      forestArea: 0,
      co2Reduction: 50,
      waterSaved: 100000,
      beneficiaries: 5000,
    },
  },
];
