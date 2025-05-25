/**
 * QRコード生成用のカスタムフック
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeType, QRCodeContent } from "../types/qrcode";
import {
  createQRCodeContent,
  formatTimeLeft,
  isQRCodeValid,
  QR_CODE_EXPIRATION,
} from "../utils/qrcode-utils";

interface UseQRCodeGeneratorProps {
  type: QRCodeType;
  initialData?: string;
  autoRefresh?: boolean;
}

interface UseQRCodeGeneratorReturn {
  qrContent: QRCodeContent | null;
  timeLeft: number;
  formattedTimeLeft: string;
  isExpired: boolean;
  isGenerating: boolean;
  error: string | null;
  generateNewCode: () => void;
  resetTimer: () => void;
}

export const useQRCodeGenerator = ({
  type,
  initialData = "",
  autoRefresh = true,
}: UseQRCodeGeneratorProps): UseQRCodeGeneratorReturn => {
  const [qrContent, setQrContent] = useState<QRCodeContent | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // QRコードを生成
  const generateNewCode = useCallback(() => {
    try {
      setIsGenerating(true);
      setError(null);

      const expirationMinutes =
        QR_CODE_EXPIRATION[
          type.toUpperCase() as keyof typeof QR_CODE_EXPIRATION
        ] / 60;
      const content = createQRCodeContent(type, initialData, expirationMinutes);

      setQrContent(content);
      setTimeLeft(expirationMinutes * 60);
    } catch (err) {
      setError("QRコードの生成に失敗しました");
      console.error("QR code generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [type, initialData]);

  // タイマーをリセット
  const resetTimer = useCallback(() => {
    if (qrContent?.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(qrContent.expiresAt);
      const secondsLeft = Math.max(
        0,
        Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
      );
      setTimeLeft(secondsLeft);
    }
  }, [qrContent]);

  // 初回生成
  useEffect(() => {
    generateNewCode();
  }, [generateNewCode]);

  // タイマー処理
  useEffect(() => {
    if (!qrContent) return;

    // 既存のタイマーをクリア
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 新しいタイマーを設定
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 自動更新が有効な場合は新しいコードを生成
          if (autoRefresh) {
            generateNewCode();
            return 0;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // クリーンアップ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [qrContent, autoRefresh, generateNewCode]);

  // 有効期限チェック
  const isExpired = qrContent ? !isQRCodeValid(qrContent.expiresAt) : false;

  return {
    qrContent,
    timeLeft,
    formattedTimeLeft: formatTimeLeft(timeLeft),
    isExpired,
    isGenerating,
    error,
    generateNewCode,
    resetTimer,
  };
};
