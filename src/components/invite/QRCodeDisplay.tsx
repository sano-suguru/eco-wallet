import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ size = 200 }: QRCodeDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);

  // QRコードのダウンロード処理（実際の実装ではcanvasからの画像取得などが必要）
  const handleDownload = () => {
    setIsLoading(true);
    // ダウンロード処理を実装
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <Card className="p-4 border-stone-200 bg-white">
        {/* QRコードライブラリを使用してここに実装 */}
        <div
          className="w-[200px] h-[200px] bg-stone-100 flex items-center justify-center"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {/* ここでは代替テキストを表示 */}
          <p className="text-xs text-stone-500 text-center">
            QRコードが表示されます
            <br />
            （実装時にはreact-qr-codeなどのライブラリを使用）
          </p>
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
        QRコードを保存
      </Button>
    </div>
  );
}
