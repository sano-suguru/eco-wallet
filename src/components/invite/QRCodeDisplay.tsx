import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);

  // QRコードのダウンロード処理
  const handleDownload = () => {
    setIsLoading(true);

    // QRコードのSVG要素を取得
    const svg = document.getElementById("invite-qrcode");
    if (!svg) {
      setIsLoading(false);
      return;
    }

    // SVGをデータURLに変換
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // 画像に変換してダウンロード
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // ダウンロード
        const link = document.createElement("a");
        link.download = "eco-wallet-invite-qrcode.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
      setIsLoading(false);
    };
    img.src = svgUrl;
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <Card className="p-4 border-stone-200 bg-white">
        <div
          className="flex items-center justify-center bg-white"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <QRCode
            id="invite-qrcode"
            value={value}
            size={size - 16} // パディングを考慮
            level="H"
            fgColor="#0F766E"
          />
        </div>
      </Card>

      <Button
        variant="outline"
        size="sm"
        className="text-xs text-stone-600 border-stone-200"
        onClick={handleDownload}
        disabled={isLoading}
      >
        <Download className="h-3 w-3 mr-1" />
        {isLoading ? "保存中..." : "QRコードを保存"}
      </Button>
    </div>
  );
}
