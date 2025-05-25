import React from "react";

interface BrandLogoProps {
  /** ロゴのサイズ（高さ） */
  size?: "small" | "medium" | "large";
  /** アニメーションの有効/無効 */
  animate?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * Eco Walletのブランドロゴコンポーネント
 */
export function BrandLogo({
  size = "large",
  animate = true,
  className = "",
}: BrandLogoProps) {
  const sizeClasses = {
    small: "h-16",
    medium: "h-20",
    large: "h-24",
  };

  const textSizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl",
  };

  return (
    <div
      className={`flex flex-col items-center ${animate ? "animate-pulse" : ""} ${className}`}
    >
      <svg
        viewBox="0 0 100 40"
        className={`${sizeClasses[size]} w-auto fill-white mb-4`}
      >
        <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
        <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="teal" />
      </svg>
      <h1 className={`${textSizeClasses[size]} font-bold text-white`}>
        Eco Wallet
      </h1>
      {size === "large" && (
        <p className="text-sm text-teal-100 mt-2">
          シンプルで環境に優しい決済サービス
        </p>
      )}
    </div>
  );
}
