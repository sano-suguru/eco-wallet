"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Receipt } from "lucide-react";

interface ActionButtonsProps {
  onShowReceipt: () => void;
  onShare?: () => void;
}

// 取引詳細ページのアクションボタンを表示するコンポーネント
const ActionButtons = React.memo(
  ({ onShowReceipt, onShare }: ActionButtonsProps) => {
    const handleShare = () => {
      if (onShare) {
        onShare();
      } else {
        // デフォルトの共有動作
        if (navigator.share) {
          navigator
            .share({
              title: "取引詳細",
              url: window.location.href,
            })
            .catch((err) => {
              // ユーザーがキャンセルした場合は何もしない（正常な動作）
              if (
                err.name === "AbortError" ||
                err.message === "Share canceled"
              ) {
                return;
              }
              // その他のエラーの場合のみログ出力
              console.error("共有に失敗しました:", err);
            });
        } else {
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => console.log("URLをクリップボードにコピーしました"))
            .catch((err) => console.error("コピーに失敗しました:", err));
        }
      }
    };

    return (
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          size="sm"
          className="text-stone-600 border-stone-200"
          onClick={onShowReceipt}
        >
          <Receipt className="h-4 w-4 mr-2" />
          電子レシートを表示
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-stone-600 border-stone-200"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          共有
        </Button>
      </div>
    );
  },
);

ActionButtons.displayName = "ActionButtons";

export default ActionButtons;
