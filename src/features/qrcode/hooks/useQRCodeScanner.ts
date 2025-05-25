"use client";

import { useState, useCallback, useRef, useEffect, RefObject } from "react";
import type { QRCodeScanResult } from "../types/qrcode";

interface UseQRCodeScannerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onScan?: (result: QRCodeScanResult) => void;
  scanInterval?: number;
}

export const useQRCodeScanner = ({
  videoRef,
  canvasRef,
  onScan,
  scanInterval = 100,
}: UseQRCodeScannerProps) => {
  const [scanResult, setScanResult] = useState<QRCodeScanResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastScannedDataRef = useRef<string | null>(null);

  // スキャンを停止
  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, []);

  // QRコードのスキャンを開始
  const startScanning = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // キャンバスのサイズをビデオに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 定期的にスキャンを実行
    scanIntervalRef.current = setInterval(() => {
      if (!video.videoWidth || !video.videoHeight) return;

      // ビデオフレームをキャンバスに描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // QRコードのスキャンを試みる（実際の実装では専用のライブラリを使用）
      // ここではモックデータを使用
      // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // 実際の実装では、jsQRなどのライブラリを使用してQRコードをデコード
      // import jsQR from 'jsqr';
      // const code = jsQR(imageData.data, imageData.width, imageData.height);

      // モック実装：5秒後に自動的にスキャン成功
      if (Date.now() % 5000 < scanInterval && Math.random() > 0.95) {
        const mockData = `ecowallet://payment/${Math.floor(100000 + Math.random() * 900000)}`;

        // 同じデータを連続してスキャンしないようにする
        if (mockData !== lastScannedDataRef.current) {
          lastScannedDataRef.current = mockData;
          const result: QRCodeScanResult = {
            data: mockData,
            timestamp: new Date(),
            format: "QR_CODE",
          };

          setScanResult(result);
          if (onScan) {
            onScan(result);
          }

          // スキャン成功後は自動的に停止
          stopScanning();
        }
      }
    }, scanInterval);
  }, [videoRef, canvasRef, scanInterval, onScan, stopScanning]);

  // カメラを開始
  const startCamera = useCallback(async () => {
    try {
      setIsCameraLoading(true);
      setError(null);

      // カメラへのアクセスを要求
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // 背面カメラを優先
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // ビデオの準備ができたらスキャンを開始
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
          setIsCameraLoading(false);
          startScanning();
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError(
        "カメラへのアクセスができませんでした。カメラの使用を許可してください。",
      );
      setIsCameraLoading(false);
      throw err;
    }
  }, [videoRef, startScanning]);

  // カメラを停止
  const stopCamera = useCallback(() => {
    stopScanning();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    lastScannedDataRef.current = null;
  }, [videoRef, stopScanning]);

  // スキャン結果をリセット
  const resetScan = useCallback(() => {
    setScanResult(null);
    lastScannedDataRef.current = null;
    setError(null);
  }, []);

  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // カメラの利用可能状態をチェック
  const checkCameraAvailability = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    scanResult,
    isCameraActive,
    isCameraLoading,
    error,
    startCamera,
    stopCamera,
    resetScan,
    checkCameraAvailability,
  };
};
