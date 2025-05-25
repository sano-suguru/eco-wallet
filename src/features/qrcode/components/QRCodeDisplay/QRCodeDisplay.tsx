"use client";

import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  level = "H",
  bgColor = "#FFFFFF",
  fgColor = "#0F766E",
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg border-2 border-stone-200 ${className}`}
    >
      <QRCode
        value={value}
        size={size}
        level={level}
        bgColor={bgColor}
        fgColor={fgColor}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};
