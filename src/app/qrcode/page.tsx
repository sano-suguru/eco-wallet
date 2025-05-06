import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Leaf, Shield, Info, MapPin, ArrowLeft } from "lucide-react";
import { QRCodeGenerator } from "./qr-code-generator";

export default function QRCodePaymentPage() {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col">
      {/* ヘッダー部分 - ティールカラーを適用 */}
      <div className="p-4 bg-teal-700 text-white shadow-md">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <Link href="/" aria-label="ホームに戻る">
              <svg viewBox="0 0 100 40" className="h-8 w-auto fill-white">
                <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
                <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="teal" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold">Eco Wallet</h1>
          </div>
          <Link href="/" aria-label="戻る">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-teal-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              戻る
            </Button>
          </Link>
          <div className="text-sm font-medium">残高: ¥8,500</div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-stone-50">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-0">
            {/* QRコードジェネレーターコンポーネント */}
            <QRCodeGenerator />

            <Separator />

            <div className="eco-contribution-container mx-4 my-4">
              <div className="flex items-start space-x-3">
                <Leaf className="h-5 w-5 text-teal-700 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-teal-800">
                    環境保全オプション有効
                  </h3>
                  <p className="text-xs text-teal-700 mt-1">
                    このお支払いの1%が山岳環境保全プロジェクトに寄付されます。
                    あなたの取引で年間約500gの紙資源を節約できます。
                  </p>
                  <Badge className="mt-2 bg-teal-100 text-teal-800 hover:bg-teal-200 text-xs">
                    CO2削減: 約5kg/年
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* バーコード表示（オプション） */}
            <div className="p-4 bg-white flex flex-col items-center">
              <p className="text-xs text-stone-600 mb-2">
                バーコード (店舗によって異なります)
              </p>
              <div className="bg-white py-2 px-4 w-full border border-stone-100 rounded-md">
                <svg viewBox="0 0 200 50" className="w-full h-12">
                  <rect x="10" y="5" width="2" height="40" fill="black" />
                  <rect x="15" y="5" width="1" height="40" fill="black" />
                  <rect x="20" y="5" width="3" height="40" fill="black" />
                  <rect x="25" y="5" width="1" height="40" fill="black" />
                  <rect x="30" y="5" width="2" height="40" fill="black" />
                  <rect x="36" y="5" width="4" height="40" fill="black" />
                  <rect x="42" y="5" width="1" height="40" fill="black" />
                  <rect x="46" y="5" width="2" height="40" fill="black" />
                  <rect x="52" y="5" width="3" height="40" fill="black" />
                  <rect x="58" y="5" width="1" height="40" fill="black" />
                  <rect x="62" y="5" width="4" height="40" fill="black" />
                  <rect x="70" y="5" width="2" height="40" fill="black" />
                  <rect x="76" y="5" width="3" height="40" fill="black" />
                  <rect x="82" y="5" width="1" height="40" fill="black" />
                  <rect x="86" y="5" width="2" height="40" fill="black" />
                  <rect x="92" y="5" width="1" height="40" fill="black" />
                  <rect x="96" y="5" width="4" height="40" fill="black" />
                  <rect x="104" y="5" width="2" height="40" fill="black" />
                  <rect x="110" y="5" width="3" height="40" fill="black" />
                  <rect x="116" y="5" width="1" height="40" fill="black" />
                  <rect x="120" y="5" width="4" height="40" fill="black" />
                  <rect x="126" y="5" width="2" height="40" fill="black" />
                  <rect x="132" y="5" width="1" height="40" fill="black" />
                  <rect x="136" y="5" width="3" height="40" fill="black" />
                  <rect x="142" y="5" width="2" height="40" fill="black" />
                  <rect x="146" y="5" width="3" height="40" fill="black" />
                  <rect x="152" y="5" width="2" height="40" fill="black" />
                  <rect x="158" y="5" width="1" height="40" fill="black" />
                  <rect x="162" y="5" width="4" height="40" fill="black" />
                  <rect x="170" y="5" width="2" height="40" fill="black" />
                  <rect x="176" y="5" width="1" height="40" fill="black" />
                  <rect x="180" y="5" width="3" height="40" fill="black" />
                  <rect x="186" y="5" width="2" height="40" fill="black" />
                </svg>
                <p className="text-xs text-center mt-1 font-mono text-stone-600">
                  8945 7120 3069 4582
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 下部のアクションエリア */}
        <div className="w-full max-w-md mt-4 flex justify-between">
          <Link href="/history">
            <Button
              variant="outline"
              size="sm"
              className="border-stone-200 text-stone-600 hover:bg-stone-100"
            >
              <Shield className="h-4 w-4 mr-2" />
              取引履歴
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-stone-200 text-stone-600 hover:bg-stone-100"
          >
            <MapPin className="h-4 w-4 mr-2" />
            近くの店舗
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-stone-200 text-stone-600 hover:bg-stone-100"
          >
            <Info className="h-4 w-4 mr-2" />
            ヘルプ
          </Button>
        </div>

        <p className="text-xs text-center text-stone-500 mt-6">
          この決済方法を選ぶことで、紙の領収書を削減し環境保全に貢献しています
        </p>
      </div>
    </div>
  );
}
