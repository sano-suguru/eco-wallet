import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  TreePine,
  Droplets,
  Globe,
  ArrowRight,
  Calendar,
  Share2,
} from "lucide-react";

export default function EcoImpactPage() {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <svg viewBox="0 0 100 40" className="h-12 w-auto fill-teal-700">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Eco Wallet
          </h1>
          <p className="text-sm text-stone-600">環境へのあなたの貢献</p>
        </div>

        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="bg-teal-800 text-white p-6">
            <h2 className="text-xl font-medium mb-2">あなたの環境インパクト</h2>
            <p className="text-sm opacity-90">2025年4月の活動状況</p>

            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80">総貢献額</p>
                <p className="text-3xl font-bold">¥12,450</p>
              </div>
              <Button className="bg-white text-teal-800 hover:bg-stone-100">
                <Share2 className="h-4 w-4 mr-2" />
                シェアする
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <Tabs defaultValue="impact" className="w-full">
              <TabsList className="grid grid-cols-3 bg-stone-100 rounded-none border-b border-stone-200">
                <TabsTrigger
                  value="impact"
                  className="text-xs rounded-none data-[state=active]:bg-white"
                >
                  インパクト
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-xs rounded-none data-[state=active]:bg-white"
                >
                  プロジェクト
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="text-xs rounded-none data-[state=active]:bg-white"
                >
                  あなたの活動
                </TabsTrigger>
              </TabsList>

              <TabsContent value="impact" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-stone-700">
                        <TreePine className="h-4 w-4 mr-2 text-teal-600" />
                        保全された森林
                      </div>
                      <span className="font-medium text-stone-900">5.2 m²</span>
                    </div>
                    <Progress value={52} />
                    <p className="text-xs text-stone-500">
                      目標: 10m² (52% 達成)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-stone-700">
                        <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                        浄化された水資源
                      </div>
                      <span className="font-medium text-stone-900">450 L</span>
                    </div>
                    <Progress value={30} />
                    <p className="text-xs text-stone-500">
                      目標: 1,500L (30% 達成)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-stone-700">
                        <Globe className="h-4 w-4 mr-2 text-green-600" />
                        CO2削減量
                      </div>
                      <span className="font-medium text-stone-900">25 kg</span>
                    </div>
                    <Progress value={25} />
                    <p className="text-xs text-stone-500">
                      目標: 100kg (25% 達成)
                    </p>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-stone-800 mb-2">
                    あなたの環境活動によるインパクト
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-teal-800">
                          1
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        あなたの寄付で5.2m²の森林が保全され、地域の在来種10種の生息地が守られています
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-teal-800">
                          2
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        紙のレシートを辞退した回数は15回で、0.5kgの紙資源を節約しました
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-teal-800">
                          3
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        リサイクル素材を使用した商品の購入により、プラスチック廃棄物1.2kgの削減に貢献しました
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4 p-6">
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-teal-800 to-blue-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TreePine className="h-16 w-16 text-white opacity-30" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-stone-800">
                      山岳環境保全プロジェクト
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      登山道の整備や森林再生などを通じて山岳環境の保全を目指します
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs">
                        <span className="text-teal-700 font-medium">
                          ¥4,500
                        </span>
                        <span className="text-stone-500"> / ¥10,000</span>
                      </div>
                      <Progress value={45} className="h-1.5 w-1/2" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 text-xs border-stone-200 text-stone-800"
                    >
                      詳細を見る
                    </Button>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-800 to-blue-400 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Droplets className="h-16 w-16 text-white opacity-30" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-stone-800">
                      海洋プラスチック削減イニシアチブ
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      海洋プラスチックの削減と海岸の清掃活動を通じて海の生態系を守ります
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs">
                        <span className="text-blue-600 font-medium">
                          ¥7,950
                        </span>
                        <span className="text-stone-500"> / ¥15,000</span>
                      </div>
                      <Progress value={53} className="h-1.5 w-1/2" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 text-xs border-stone-200 text-stone-800"
                    >
                      詳細を見る
                    </Button>
                  </div>
                </div>

                <Button className="w-full text-teal-700 bg-white border border-teal-200 hover:bg-teal-50">
                  すべてのプロジェクトを見る{" "}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 p-6">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-stone-800">
                    環境貢献活動の履歴
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-stone-600"
                  >
                    <Calendar className="h-3 w-3 mr-1" /> 期間
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="border-l-2 border-teal-500 pl-4 pb-4 relative">
                    <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-teal-500" />
                    <p className="text-xs text-stone-500">2025/04/19</p>
                    <h4 className="text-sm font-medium text-stone-800">
                      エコ製品定期プラン購入
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      エコ製品の購入で、¥200を環境保全に寄付しました
                    </p>
                    <div className="mt-1 flex items-center text-xs text-teal-600">
                      <Leaf className="h-3 w-3 mr-1" />
                      CO2削減量: 3.2kg
                    </div>
                  </div>

                  <div className="border-l-2 border-stone-300 pl-4 pb-4 relative">
                    <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-stone-300" />
                    <p className="text-xs text-stone-500">2025/04/10</p>
                    <h4 className="text-sm font-medium text-stone-800">
                      オーガニックコットンTシャツ購入
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      環境に配慮した商品の購入で、¥150を環境保全に寄付しました
                    </p>
                    <div className="mt-1 flex items-center text-xs text-teal-600">
                      <Leaf className="h-3 w-3 mr-1" />
                      森林保全: 0.7m²
                    </div>
                  </div>

                  <div className="border-l-2 border-stone-300 pl-4 pb-4 relative">
                    <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-stone-300" />
                    <p className="text-xs text-stone-500">2025/04/05</p>
                    <h4 className="text-sm font-medium text-stone-800">
                      リサイクルフリース購入
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      リサイクル素材を使用した商品の購入で、¥500を環境保全に寄付しました
                    </p>
                    <div className="mt-1 flex items-center text-xs text-teal-600">
                      <Leaf className="h-3 w-3 mr-1" />
                      プラスチック削減: 1.2kg
                    </div>
                  </div>
                </div>

                <Button className="w-full text-stone-600 border border-stone-200 hover:bg-stone-50">
                  すべての活動を見る
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center space-x-2 bg-teal-50 rounded-md p-3 border border-teal-100">
          <div className="flex-1 text-sm">
            <h3 className="font-medium text-teal-800">
              環境貢献をさらに高めよう
            </h3>
            <p className="text-xs text-teal-700 mt-1">
              次回の購入時に「環境負担金の上乗せ」を選択すると、より大きな環境保全に貢献できます
            </p>
          </div>
          <Button
            size="sm"
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            設定する
          </Button>
        </div>

        <p className="text-xs text-center text-stone-500">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
