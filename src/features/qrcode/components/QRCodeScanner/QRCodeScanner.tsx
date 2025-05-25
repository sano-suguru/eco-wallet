"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Camera, Loader2, X } from "lucide-react";
import { useQRCodeScanner } from "../../hooks/useQRCodeScanner";
import type { QRCodeScanResult } from "../../types/qrcode";

interface QRCodeScannerProps {
  onScan?: (result: QRCodeScanResult) => void;
  onError?: (error: string) => void;
  showHeader?: boolean;
  className?: string;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onError,
  showHeader = true,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    scanResult,
    isCameraActive,
    isCameraLoading,
    error,
    startCamera,
    stopCamera,
    resetScan,
  } = useQRCodeScanner({
    videoRef,
    canvasRef,
  });

  // カメラの開始/停止
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
      setIsScanning(false);
    } else {
      try {
        setCameraError(null);
        setIsScanning(true);
        await startCamera();
      } catch {
        setCameraError("カメラへのアクセスが拒否されました");
        setIsScanning(false);
      }
    }
  };

  // スキャン結果の処理
  useEffect(() => {
    if (scanResult && onScan) {
      onScan(scanResult);
      // 自動的にカメラを停止
      stopCamera();
      setIsScanning(false);
    }
  }, [scanResult, onScan, stopCamera]);

  // エラーの処理
  useEffect(() => {
    if (error) {
      if (onError) {
        onError(error);
      }
      setCameraError(error);
    }
  }, [error, onError]);

  // コンポーネントのアンマウント時にカメラを停止
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive, stopCamera]);

  return (
    <div className={className}>
      {showHeader && (
        <div className="p-4 bg-white border-b">
          <h2 className="text-lg font-medium text-stone-800">
            QRコードスキャナー
          </h2>
          <p className="text-sm text-stone-600">
            QRコードをカメラに映してスキャンしてください
          </p>
        </div>
      )}

      <div className="bg-white p-6">
        {/* カメラビュー */}
        {isScanning && (
          <div className="relative w-full max-w-md mx-auto mb-4">
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ display: "none" }}
              />

              {/* スキャンフレーム */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  {/* 四隅の角 */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-teal-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-teal-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-teal-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-teal-500"></div>

                  {/* スキャンライン（アニメーション） */}
                  <div className="absolute left-0 right-0 h-0.5 bg-teal-500 animate-scan"></div>
                </div>
              </div>

              {/* 閉じるボタン */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                onClick={handleToggleCamera}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* エラー表示 */}
        {cameraError && (
          <Alert variant="destructive" className="mb-4">
            <p className="text-sm">{cameraError}</p>
          </Alert>
        )}

        {/* スキャン結果表示 */}
        {scanResult && (
          <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <h3 className="text-sm font-medium text-teal-800 mb-1">
              スキャン成功
            </h3>
            <p className="text-sm text-teal-700 font-mono break-all">
              {scanResult.data}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={resetScan}
              className="mt-2"
            >
              再スキャン
            </Button>
          </div>
        )}

        {/* カメラ起動ボタン */}
        {!isScanning && !scanResult && (
          <div className="text-center">
            <Button
              onClick={handleToggleCamera}
              disabled={isCameraLoading}
              className="bg-teal-700 hover:bg-teal-800 text-white"
            >
              {isCameraLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  カメラを起動中...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  QRコードをスキャン
                </>
              )}
            </Button>
          </div>
        )}

        {/* 使用方法 */}
        {!isScanning && !scanResult && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-stone-800">使用方法：</h3>
            <ol className="text-sm text-stone-600 space-y-1 list-decimal list-inside">
              <li>「QRコードをスキャン」ボタンをタップ</li>
              <li>カメラへのアクセスを許可</li>
              <li>QRコードをフレーム内に収める</li>
              <li>自動的にスキャンされます</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
