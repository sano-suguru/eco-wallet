"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export function QRCodeGenerator() {
  const [securityCode, setSecurityCode] = useState("287954");
  const [timeLeft, setTimeLeft] = useState(240); // 4分（秒単位）

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

  // 残り時間の表示形式を整形
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-stone-800">お支払いコード</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 p-0 w-8"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4 text-stone-600" />
          </Button>
        </div>
        <p className="text-sm text-stone-600">
          店舗のスキャナーにかざしてください
        </p>
      </div>

      {/* QRコード表示エリア */}
      <div className="bg-white p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-4 rounded-lg border-2 border-stone-200 w-64 h-64 flex items-center justify-center">
          {/* ダミーQRコード（実際にはsecurityCodeに基づいて生成） */}
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

        <div className="text-center mt-4">
          <p className="text-xs text-stone-500">
            有効期限: あと{formatTime(timeLeft)}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            セキュリティコード: {securityCode}
          </p>
        </div>
      </div>
    </>
  );
}
