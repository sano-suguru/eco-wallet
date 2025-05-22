"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Receipt, Share2 } from "lucide-react";

interface ActionButtonsProps {
  onShowReceipt: () => void;
  onShare: () => void;
}

export const ActionButtons = React.memo(
  ({ onShowReceipt, onShare }: ActionButtonsProps) => {
    return (
      <div className="flex flex-col space-y-2 mt-5 mb-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex justify-center items-center border-stone-200 hover:border-stone-300 hover:bg-stone-50"
          onClick={onShowReceipt}
        >
          <Receipt className="h-4 w-4 mr-1.5 text-stone-600" />
          <span>電子レシートを表示</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full flex justify-center items-center border-stone-200 hover:border-stone-300 hover:bg-stone-50"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-1.5 text-stone-600" />
          <span>この取引を共有</span>
        </Button>
      </div>
    );
  },
);

ActionButtons.displayName = "ActionButtons";
