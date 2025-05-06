"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function QRCodeGenerator() {
  const [securityCode, setSecurityCode] = useState("287954");
  const [timeLeft, setTimeLeft] = useState(240); // 4分（秒単位）
  const [copied, setCopied] = useState(false);

  // タイマー処理
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // タイムアウト時に自動的にコードを更新
          handleRefresh();
          return 240;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // QRコードとセキュリティコードをリフレッシュ
  const handleRefresh = () => {
    // ランダムな6桁の数字を生成
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSecurityCode(newCode);
    setTimeLeft(240); // 4分にリセット
  };

  // セキュリティコードをコピー
  const copySecurityCode = () => {
    navigator.clipboard.writeText(securityCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 残り時間の表示形式を整形
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 進捗バーの計算
  const progressValue = (timeLeft / 240) * 100;

  return (
    <>
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-stone-800">お支払いコード</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 p-0 w-8 text-teal-700 hover:bg-teal-50"
            onClick={handleRefresh}
            aria-label="コードを更新"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-stone-600">
          店舗のスキャナーにかざしてください
        </p>
      </div>

      {/* QRコード表示エリア */}
      <div className="bg-white p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-4 rounded-lg border-2 border-stone-200 w-64 h-64 flex items-center justify-center">
          {/* ここでは代替テキストを表示 */}
          <svg width="200" height="200" viewBox="0 0 200 200">
            <rect x="0" y="0" width="200" height="200" fill="white" />
            <rect x="20" y="20" width="40" height="40" fill="black" />
            <rect x="140" y="20" width="40" height="40" fill="black" />
            <rect x="20" y="140" width="40" height="40" fill="black" />
            <rect x="70" y="70" width="60" height="60" fill="black" />
            <rect x="70" y="20" width="10" height="40" fill="black" />
            <rect x="120" y="70" width="10" height="40" fill="black" />
            <rect x="20" y="70" width="40" height="10" fill="black" />
            <rect x="70" y="140" width="40" height="10" fill="black" />
            <rect x="140" y="90" width="10" height="90" fill="black" />
            <rect x="160" y="140" width="20" height="20" fill="black" />

            {/* セキュリティコードを表す模様を動的に変更（簡易的な実装） */}
            <rect
              x={((parseInt(securityCode[0]) * 10) % 100) + 50}
              y={((parseInt(securityCode[1]) * 10) % 100) + 50}
              width="15"
              height="15"
              fill="black"
            />
            <rect
              x={(parseInt(securityCode[2]) * 10) % 150}
              y={(parseInt(securityCode[3]) * 10) % 100}
              width="10"
              height="10"
              fill="black"
            />
          </svg>
        </div>

        <div className="mt-4 w-full">
          {/* タイマー表示 */}
          <div className="flex justify-between items-center text-xs text-stone-600 mb-1">
            <span>有効期限:</span>
            <span className={timeLeft < 60 ? "text-red-500 font-medium" : ""}>
              あと{formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={progressValue} className="h-1.5 bg-stone-100" />
        </div>

        {/* セキュリティコード表示 - コピー機能付き */}
        <div
          className="mt-4 flex items-center justify-center border border-stone-200 rounded-md p-2 cursor-pointer hover:bg-stone-50"
          onClick={copySecurityCode}
        >
          <span className="text-sm text-stone-800 font-mono mr-2">
            セキュリティコード: {securityCode}
          </span>
          {copied ? (
            <CheckCircle className="h-4 w-4 text-teal-600" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-stone-500"
              aria-label="コードをコピー"
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
      </div>
    </>
  );
}
