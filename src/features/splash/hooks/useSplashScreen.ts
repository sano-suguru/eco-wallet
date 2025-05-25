"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  SplashStatus,
  SplashConfig,
  DEFAULT_SPLASH_CONFIG,
  InitializationState,
} from "../types/splash";
import {
  initializeApp,
  calculateRemainingDelay,
  determineRedirectPath,
} from "../utils/initialization";

/**
 * スプラッシュ画面の制御を行うカスタムフック
 * @param config スプラッシュ画面の設定
 * @returns スプラッシュ画面の状態と制御関数
 */
export function useSplashScreen(config?: Partial<SplashConfig>) {
  const router = useRouter();
  const { status } = useSession();
  const [splashStatus, setSplashStatus] = useState<SplashStatus>("loading");
  const [initState, setInitState] = useState<InitializationState>({
    authChecked: false,
    configLoaded: false,
    dataLoaded: false,
  });

  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_SPLASH_CONFIG, ...config }),
    [config],
  );
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const startTime = Date.now();

    const initialize = async () => {
      try {
        // アプリケーションの初期化
        const state = await initializeApp();
        setInitState(state);

        if (state.error) {
          setSplashStatus("error");
          return;
        }

        // 最小表示時間を考慮した遅延
        const remainingDelay = calculateRemainingDelay(
          startTime,
          mergedConfig.minimumDisplayTime,
        );
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));

        // 表示時間の遅延
        const displayDelay = Math.max(
          0,
          mergedConfig.displayDuration - (Date.now() - startTime),
        );
        await new Promise((resolve) => setTimeout(resolve, displayDelay));

        setSplashStatus("completed");

        // リダイレクト処理
        const redirectPath = determineRedirectPath(isAuthenticated);
        router.push(redirectPath);
      } catch (error) {
        console.error("Splash screen initialization error:", error);
        setSplashStatus("error");
      }
    };

    // 認証状態が確定してから初期化を開始
    if (status !== "loading") {
      initialize();
    }
  }, [status, isAuthenticated, router, mergedConfig]);

  return {
    status: splashStatus,
    initializationState: initState,
    isAnimationEnabled: mergedConfig.enableAnimation,
  };
}
