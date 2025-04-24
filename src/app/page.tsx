import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Send,
  Users,
  Plus,
  CreditCard,
  Newspaper,
  ChevronRight,
  TreePine,
  Droplets,
  Globe,
  Settings,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col">
      {/* ヘッダー部分 */}
      <div className="p-4 bg-teal-800 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 100 40" className="h-8 w-auto fill-white">
              <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
              <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="teal" />
            </svg>
            <h1 className="text-lg font-bold">Eco Wallet</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-8 w-8 rounded-full"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Avatar className="h-8 w-8 border border-white/30">
              <AvatarImage src="/api/placeholder/32/32" alt="ユーザー" />
              <AvatarFallback className="bg-teal-700 text-white">
                山田
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-4 space-y-6 max-w-3xl mx-auto w-full pb-20">
        {/* 残高カード */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-teal-800 to-teal-700 p-5 text-white">
            <p className="text-xs opacity-80">現在の残高</p>
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-bold mt-1">¥8,500</h2>
              <Link href="/charge">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  チャージ
                  <Plus className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="grid grid-cols-4 divide-x divide-stone-100">
              <Link href="/qrcode" className="w-full">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center py-4 rounded-none h-auto w-full"
                >
                  <QrCode className="h-5 w-5 mb-1 text-teal-700" />
                  <span className="text-xs">支払う</span>
                </Button>
              </Link>
              <Link href="/transfer" className="w-full">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center py-4 rounded-none h-auto w-full"
                >
                  <Send className="h-5 w-5 mb-1 text-teal-700" />
                  <span className="text-xs">送金</span>
                </Button>
              </Link>
              <Link href="/transfer?tab=split" className="w-full">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center py-4 rounded-none h-auto w-full"
                >
                  <Users className="h-5 w-5 mb-1 text-teal-700" />
                  <span className="text-xs">割り勘</span>
                </Button>
              </Link>
              <Link href="/payment" className="w-full">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center py-4 rounded-none h-auto w-full"
                >
                  <CreditCard className="h-5 w-5 mb-1 text-teal-700" />
                  <span className="text-xs">決済</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 環境インパクト概要 */}
        <Card className="border-0 shadow-md bg-white p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-stone-800 flex items-center">
              <Leaf className="h-4 w-4 mr-1 text-teal-600" />
              あなたの環境貢献
            </h3>
            <Badge className="bg-teal-100 text-teal-800">エコマイスター</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-stone-50 p-2 rounded-md text-center">
              <div className="flex justify-center mb-1">
                <TreePine className="h-5 w-5 text-teal-600" />
              </div>
              <p className="text-xs text-stone-600">森林保全</p>
              <p className="text-sm font-medium text-stone-800">5.2 m²</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-md text-center">
              <div className="flex justify-center mb-1">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-stone-600">水資源保全</p>
              <p className="text-sm font-medium text-stone-800">450 L</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-md text-center">
              <div className="flex justify-center mb-1">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-stone-600">CO2削減</p>
              <p className="text-sm font-medium text-stone-800">25 kg</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-600">目標達成度</span>
              <span className="text-teal-600 font-medium">42%</span>
            </div>
            <Progress value={42} />
          </div>

          <Link href="/impact">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 text-xs border-stone-200 text-teal-700"
            >
              詳細を見る
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </Card>

        {/* 取引履歴 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-stone-800">最近の取引</h3>
            <Link href="/history">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-stone-500"
              >
                すべて見る
              </Button>
            </Link>
          </div>

          <Card className="border-0 shadow-md bg-white divide-y divide-stone-100">
            <div className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-800">
                    エコ製品定期プラン
                  </h4>
                  <p className="text-xs text-stone-500">2025/04/19</p>
                </div>
              </div>
              <div className="text-sm font-medium text-stone-800">-¥4,000</div>
            </div>

            <div className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-800">
                    Eco Walletチャージ
                  </h4>
                  <p className="text-xs text-stone-500">2025/04/15</p>
                </div>
              </div>
              <div className="text-sm font-medium text-green-600">+¥10,000</div>
            </div>

            <div className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-800">
                    オーガニックコットンTシャツ
                  </h4>
                  <div className="flex items-center">
                    <p className="text-xs text-stone-500">2025/04/10</p>
                    <Badge className="ml-2 bg-teal-100 text-teal-800 text-[10px] py-0 h-4">
                      <Leaf className="h-2 w-2 mr-0.5" />
                      環境貢献
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-stone-800">-¥3,200</div>
            </div>
          </Card>
        </div>

        {/* 環境ニュースとプロジェクト */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-stone-800 flex items-center">
              <Newspaper className="h-4 w-4 mr-1 text-stone-600" />
              エコニュースとプロジェクト
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-stone-500"
            >
              もっと見る
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="aspect-[2/1] bg-teal-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <TreePine className="h-12 w-12 text-teal-700 opacity-30" />
                </div>
              </div>
              <CardContent className="p-3">
                <Badge className="bg-blue-100 text-blue-800 mb-2">
                  ニュース
                </Badge>
                <h4 className="text-sm font-medium text-stone-800">
                  富士山のトレイル修復プロジェクト始動
                </h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                  登山人気の高まりで損傷が進んだ富士山のトレイルを持続可能な方法で修復するプロジェクトが始動しました。このプロジェクトではEco
                  Walletユーザーからの寄付も活用されます。
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-teal-700"
                >
                  詳細を読む
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <CardContent className="p-3">
                <Badge className="bg-green-100 text-green-800 mb-2">
                  プロジェクト
                </Badge>
                <h4 className="text-sm font-medium text-stone-800">
                  山岳環境保全プロジェクト
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  登山道の整備や森林再生などを通じて山岳環境の保全を目指します
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs">
                    <span className="text-teal-700 font-medium">¥4,500</span>
                    <span className="text-stone-500"> / ¥10,000</span>
                  </div>
                  <Progress value={45} className="h-1.5 w-1/2" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs border-teal-200 text-teal-700"
                >
                  寄付する
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* おすすめ環境アクション */}
        <Card className="border shadow-md bg-teal-50 p-4 border-teal-100">
          <div className="flex items-start space-x-3">
            <Leaf className="h-5 w-5 text-teal-700 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-teal-800">
                今月のおすすめアクション
              </h3>
              <p className="text-xs text-teal-700 mt-1">
                決済額からの環境貢献を3%に増やすと、1ヶ月で森林保全面積を約2m²追加できます。
              </p>
              <Link href="/settings?tab=eco">
                <Button className="w-full mt-3 bg-teal-700 hover:bg-teal-800 text-white text-xs">
                  環境貢献を増やす
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* フッターナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 py-2 px-4">
        <div className="flex justify-around max-w-3xl mx-auto">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex flex-col items-center p-1 h-auto"
            >
              <svg viewBox="0 0 100 40" className="h-6 w-auto fill-teal-700">
                <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
                <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
              </svg>
              <span className="text-xs mt-1 text-teal-700 font-medium">
                ホーム
              </span>
            </Button>
          </Link>
          <Link href="/qrcode">
            <Button
              variant="ghost"
              className="flex flex-col items-center p-1 h-auto"
            >
              <QrCode className="h-5 w-5 text-stone-500" />
              <span className="text-xs mt-1 text-stone-500">支払う</span>
            </Button>
          </Link>
          <Link href="/impact">
            <Button
              variant="ghost"
              className="flex flex-col items-center p-1 h-auto"
            >
              <Leaf className="h-5 w-5 text-stone-500" />
              <span className="text-xs mt-1 text-stone-500">環境</span>
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant="ghost"
              className="flex flex-col items-center p-1 h-auto"
            >
              <CreditCard className="h-5 w-5 text-stone-500" />
              <span className="text-xs mt-1 text-stone-500">取引</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="ghost"
              className="flex flex-col items-center p-1 h-auto"
            >
              <Avatar className="h-5 w-5 border border-stone-200">
                <AvatarFallback className="text-[10px]">山田</AvatarFallback>
              </Avatar>
              <span className="text-xs mt-1 text-stone-500">アカウント</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
