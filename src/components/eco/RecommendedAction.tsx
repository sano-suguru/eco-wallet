import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { recommendedActions } from "@/lib/mock-data/recommended-actions";

interface RecommendedActionProps {
  actionId?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
}

export function RecommendedAction({
  actionId,
  title,
  description,
  actionLabel,
  actionLink,
}: RecommendedActionProps) {
  // actionIdが指定されている場合は、そのアクションを表示
  // そうでない場合は、パラメータに基づいてカスタムアクションを表示、
  // または最優先のアクションを表示
  let actionToShow;

  if (actionId) {
    actionToShow = recommendedActions.find((action) => action.id === actionId);
  } else if (title && description) {
    actionToShow = {
      id: "custom",
      title,
      description,
      actionLabel: actionLabel || "詳細を見る",
      actionLink: actionLink || "#",
      icon: "leaf",
      priority: 0,
    };
  } else {
    // 優先度順にソートして最初のアクションを取得
    actionToShow = [...recommendedActions].sort(
      (a, b) => a.priority - b.priority,
    )[0];
  }

  if (!actionToShow) return null;

  return (
    <Card className="border shadow-md bg-teal-50 p-4 border-teal-100">
      <div className="flex items-start space-x-3">
        <Leaf className="h-5 w-5 text-teal-700 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-teal-800">
            {actionToShow.title}
          </h3>
          <p className="text-xs text-teal-700 mt-1">
            {actionToShow.description}
          </p>
          <Link href={actionToShow.actionLink}>
            <Button className="w-full mt-3 bg-teal-700 hover:bg-teal-800 text-white text-xs">
              {actionToShow.actionLabel}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
