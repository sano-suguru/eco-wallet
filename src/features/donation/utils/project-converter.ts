import { ProjectItem } from "@/features/eco-news";
import { DonationProject } from "../types/donation";

/**
 * ProjectItem を DonationProject に変換する関数
 */
export function convertProjectItemToDonationProject(
  projectItem: ProjectItem,
): DonationProject {
  return {
    id: projectItem.id,
    title: projectItem.title,
    description: projectItem.description,
    category: projectItem.category,
    targetAmount: projectItem.targetFunding,
    currentAmount: projectItem.currentFunding,
    progressPercent: projectItem.progressPercent,
    imageType:
      projectItem.imageType === "default"
        ? "forest"
        : projectItem.imageType || "forest",
    organization: "環境保全団体", // デフォルト値
    endDate: "2025/12/31", // デフォルト値
    impact: {
      // プロジェクトの種類に基づいてデフォルトの環境インパクトを設定
      forestArea:
        projectItem.imageType === "forest" ||
        projectItem.imageType === "mountain"
          ? 100
          : 0,
      co2Reduction: 50,
      waterSaved: projectItem.imageType === "ocean" ? 1000 : 500,
      beneficiaries: 1000,
    },
  };
}
