"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { ProjectItem } from "@/lib/mock-data/news-projects";

interface ProjectInfoProps {
  project: ProjectItem;
}

// プロジェクト情報表示専用のプレゼンテーションコンポーネント
const ProjectInfo = React.memo(({ project }: ProjectInfoProps) => {
  // プロジェクトタイプに基づくアイコンの取得
  const getProjectIcon = () => {
    switch (project.imageType) {
      case "ocean":
        return (
          <svg
            className="h-16 w-16 text-blue-500 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12h20" />
            <path d="M5 12c.5-4.5 4-8 10-8" />
            <path d="M7 12c.5-2.5 2-5 5-5" />
            <path d="M19 12c-.5-4.5-4-8-10-8" />
            <path d="M17 12c-.5-2.5-2-5-5-5" />
            <path d="M2 12c0 4.5 3.5 8 8 9" />
            <path d="M22 12c0 4.5-3.5 8-8 9" />
          </svg>
        );
      case "mountain":
      default:
        return (
          <svg
            className="h-16 w-16 text-teal-700 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3v4l-4 4" />
            <path d="M4 11v4h4" />
            <path d="M4 15l6 6" />
            <path d="M14 15l6 6" />
            <path d="M8 21h8" />
            <path d="M16 3v4l4 4" />
            <path d="M20 11v4h-4" />
            <path d="M8 3h8" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getProjectIcon()}</div>
        <div>
          <p className="text-sm text-teal-800">{project.description}</p>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-600">進捗状況</span>
              <span className="text-teal-700 font-medium">
                {project.progressPercent}%
              </span>
            </div>
            <Progress
              value={project.progressPercent}
              className="h-1.5 bg-teal-100"
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-teal-800 font-medium">
                ¥{project.currentFunding.toLocaleString()}
              </span>
              <span className="text-stone-500">
                目標: ¥{project.targetFunding.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectInfo.displayName = "ProjectInfo";

export default ProjectInfo;
