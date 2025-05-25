"use client";

import React from "react";
import { BrandLogo } from "../BrandLogo";
import { InitializationStatus } from "../InitializationStatus";
import { useSplashScreen } from "../../hooks/useSplashScreen";
import { SplashScreenProps } from "../../types/splash";

/**
 * スプラッシュ画面のメインコンポーネント
 */
export function SplashScreen({ config, onComplete }: SplashScreenProps) {
  const { status, initializationState, isAnimationEnabled } =
    useSplashScreen(config);

  // 初期化完了時のコールバック
  React.useEffect(() => {
    if (status === "completed" && onComplete) {
      onComplete();
    }
  }, [status, onComplete]);

  return (
    <div className="min-h-screen bg-teal-800 flex flex-col items-center justify-center">
      <BrandLogo size="large" animate={isAnimationEnabled} />

      <InitializationStatus
        state={initializationState}
        showError={status === "error"}
      />
    </div>
  );
}
