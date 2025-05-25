"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQRCodeGenerator } from "../../hooks/useQRCodeGenerator";
import { QRCodeDisplay } from "../QRCodeDisplay";
import type { QRCodeType, QRCodeGeneratorOptions } from "../../types/qrcode";

interface QRCodeGeneratorProps {
  type?: QRCodeType;
  options?: QRCodeGeneratorOptions;
  showHeader?: boolean;
  showSecurityCode?: boolean;
  showTimer?: boolean;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  type = "payment",
  options = {
    size: 200,
    level: "H",
    fgColor: "#0F766E",
  },
  showHeader = true,
  showSecurityCode = true,
  showTimer = true,
  className = "",
}) => {
  const {
    qrContent,
    timeLeft,
    formattedTimeLeft,
    isExpired,
    isGenerating,
    error,
    generateNewCode,
  } = useQRCodeGenerator({ type });

  const [copied, setCopied] = useState(false);

  // セキュリティコードをコピー
  const copySecurityCode = () => {
    if (qrContent?.securityCode) {
      navigator.clipboard.writeText(qrContent.securityCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 進捗バーの計算
  const totalTime = type === "payment" ? 240 : 600; // 支払いは4分、その他は10分
  const progressValue = (timeLeft / totalTime) * 100;

  if (error) {
    return (
      <div className={`p-4 bg-red-50 text-red-600 rounded-lg ${className}`}>
        <p className="text-sm">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={generateNewCode}
          className="mt-2"
        >
          再試行
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="p-4 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-stone-800">
              {type === "payment" ? "お支払いコード" : "QRコード"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-0 w-8 text-teal-700 hover:bg-teal-50"
              onClick={generateNewCode}
              disabled={isGenerating}
              aria-label="コードを更新"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <p className="text-sm text-stone-600">
            {type === "payment"
              ? "店舗のスキャナーにかざしてください"
              : "QRコードをスキャンしてください"}
          </p>
        </div>
      )}

      {/* QRコード表示エリア */}
      <div className="bg-white p-6 flex flex-col items-center justify-center">
        {qrContent && (
          <QRCodeDisplay
            value={qrContent.data}
            size={options.size}
            level={options.level}
            fgColor={options.fgColor}
            bgColor={options.bgColor}
          />
        )}

        {showTimer && (
          <div className="mt-4 w-full max-w-xs">
            {/* タイマー表示 */}
            <div className="flex justify-between items-center text-xs text-stone-600 mb-1">
              <span>有効期限:</span>
              <span className={timeLeft < 60 ? "text-red-500 font-medium" : ""}>
                あと{formattedTimeLeft}
              </span>
            </div>
            <Progress value={progressValue} className="h-1.5 bg-stone-100" />
          </div>
        )}

        {/* セキュリティコード表示 - コピー機能付き */}
        {showSecurityCode && qrContent?.securityCode && (
          <div
            className="mt-4 flex items-center justify-center border border-stone-200 rounded-md p-2 cursor-pointer hover:bg-stone-50"
            onClick={copySecurityCode}
          >
            <span className="text-sm text-stone-800 font-mono mr-2">
              セキュリティコード: {qrContent.securityCode}
            </span>
            {copied ? (
              <CheckCircle className="h-4 w-4 text-teal-600" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-stone-500"
                aria-label="コードをコピー"
                onClick={(e) => {
                  e.stopPropagation();
                  copySecurityCode();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </Button>
            )}
          </div>
        )}

        {isExpired && (
          <div className="mt-4 text-sm text-red-600">
            QRコードの有効期限が切れました。更新してください。
          </div>
        )}
      </div>
    </div>
  );
};
