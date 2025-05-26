"use client";

import { useState } from "react";
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
  Medal,
  Target,
  TrendingUp,
  Info,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/features/layout/components/PageContainer";

interface ImpactMetric {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string;
  target: string;
  progress: number;
  color: string;
  bgColor: string;
  unit: string;
}

const impactMetrics: ImpactMetric[] = [
  {
    id: "forest",
    icon: TreePine,
    label: "保全された森林",
    value: "5.2",
    target: "10",
    progress: 52,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    unit: "m²",
  },
  {
    id: "water",
    icon: Droplets,
    label: "浄化された水資源",
    value: "450",
    target: "1,500",
    progress: 30,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    unit: "L",
  },
  {
    id: "co2",
    icon: Globe,
    label: "CO2削減量",
    value: "25",
    target: "100",
    progress: 25,
    color: "text-green-600",
    bgColor: "bg-green-50",
    unit: "kg",
  },
];

export default function EcoImpactPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <PageContainer>
      <div className="w-full max-w-md mx-auto space-y-4">
        {/* メインカード */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          {/* ヘッダー：グラデーション背景 */}
          <div className="bg-gradient-to-br from-teal-700 to-teal-600 text-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">環境インパクト</h2>
                <p className="text-sm text-teal-50">2025年4月の活動状況</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* 統計サマリー */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-teal-50 mb-1">総貢献額</p>
                <p className="text-2xl font-bold">¥12,450</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-teal-50 mb-1">環境ランク</p>
                <div className="flex items-center gap-1">
                  <Medal className="h-4 w-4 text-amber-300" />
                  <p className="text-lg font-semibold">エコマイスター</p>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <Tabs defaultValue="impact" className="w-full">
              <TabsList className="grid grid-cols-3 bg-stone-50 rounded-none border-b border-stone-200 h-12">
                <TabsTrigger
                  value="impact"
                  className="text-sm font-medium rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700"
                >
                  インパクト
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-sm font-medium rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700"
                >
                  プロジェクト
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="text-sm font-medium rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700"
                >
                  活動履歴
                </TabsTrigger>
              </TabsList>

              {/* インパクトタブ */}
              <TabsContent value="impact" className="p-4 space-y-4">
                {/* 期間選択 */}
                <div className="flex gap-2 justify-center">
                  {["week", "month", "year"].map((period) => (
                    <Button
                      key={period}
                      variant={
                        selectedPeriod === period ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className={
                        selectedPeriod === period
                          ? "bg-teal-600 hover:bg-teal-700 text-white"
                          : "border-stone-200 hover:border-stone-300"
                      }
                    >
                      {period === "week" && "週間"}
                      {period === "month" && "月間"}
                      {period === "year" && "年間"}
                    </Button>
                  ))}
                </div>

                {/* 環境指標 */}
                <div className="space-y-3">
                  {impactMetrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={metric.id}
                        className="bg-white rounded-lg border border-stone-100 p-4 hover:border-stone-200 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`${metric.bgColor} p-2 rounded-lg`}>
                              <Icon className={`h-5 w-5 ${metric.color}`} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-stone-800">
                                {metric.label}
                              </h4>
                              <p
                                className={`text-xs ${metric.color} font-medium mt-0.5`}
                              >
                                目標達成率 {metric.progress}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-stone-900">
                              {metric.value}
                              <span className="text-sm font-normal text-stone-500 ml-1">
                                {metric.unit}
                              </span>
                            </p>
                            <p className="text-xs text-stone-500">
                              / {metric.target}
                              {metric.unit}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress
                            value={metric.progress}
                            className={`h-2 bg-stone-100 ${
                              metric.id === "forest"
                                ? ""
                                : metric.id === "water"
                                  ? "bg-blue-500"
                                  : "bg-green-600"
                            }`}
                          />
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-500">0</span>
                            <span className={`${metric.color} font-medium`}>
                              {metric.value}
                              {metric.unit}
                            </span>
                            <span className="text-stone-500">
                              {metric.target}
                              {metric.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 環境貢献の詳細 */}
                <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-teal-800 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    あなたの貢献による実際の効果
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs text-teal-700 leading-relaxed">
                        5.2m²の森林保全により、年間約62kgのCO2を吸収し、10種類の在来種の生息地を守っています
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs text-teal-700 leading-relaxed">
                        450Lの水資源浄化は、約225人が1日に使用する飲料水に相当します
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs text-teal-700 leading-relaxed">
                        25kgのCO2削減は、ガソリン車で約100km走行時の排出量に相当します
                      </p>
                    </div>
                  </div>
                </div>

                {/* 次のアクション */}
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-amber-800 flex items-center mb-1">
                        <Target className="h-4 w-4 mr-2" />
                        目標達成まであと少し！
                      </h3>
                      <p className="text-xs text-amber-700">
                        環境貢献率を1%から3%に増やすと、年間の森林保全面積が約3倍になります
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white ml-3"
                    >
                      設定変更
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* プロジェクトタブ */}
              <TabsContent value="projects" className="p-4 space-y-4">
                {/* プロジェクトカード */}
                {[
                  {
                    id: 1,
                    title: "山岳環境保全プロジェクト",
                    description: "登山道の整備や森林再生を通じて山岳環境を保全",
                    icon: TreePine,
                    amount: 4500,
                    target: 10000,
                    color: "teal",
                    gradient: "from-teal-600 to-teal-500",
                  },
                  {
                    id: 2,
                    title: "海洋プラスチック削減",
                    description: "海岸清掃と海洋生態系の保護活動",
                    icon: Droplets,
                    amount: 7950,
                    target: 15000,
                    color: "blue",
                    gradient: "from-blue-600 to-blue-500",
                  },
                  {
                    id: 3,
                    title: "都市緑化プロジェクト",
                    description: "都市部の緑地拡大と生物多様性の促進",
                    icon: Leaf,
                    amount: 3200,
                    target: 8000,
                    color: "green",
                    gradient: "from-green-600 to-green-500",
                  },
                ].map((project) => {
                  const Icon = project.icon;
                  const progress = (project.amount / project.target) * 100;

                  return (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg border border-stone-100 overflow-hidden hover:border-stone-200 hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="h-20 w-20 text-white opacity-20" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                            進行中
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-stone-800 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-stone-600 mb-3">
                          {project.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span
                              className={`text-${project.color}-600 font-semibold`}
                            >
                              ¥{project.amount.toLocaleString()}
                            </span>
                            <span className="text-stone-500">
                              目標: ¥{project.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={progress}
                            className={`h-1.5 bg-stone-100 ${
                              project.color === "teal"
                                ? ""
                                : project.color === "blue"
                                  ? "bg-blue-500"
                                  : "bg-green-600"
                            }`}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-stone-500">
                              達成率 {Math.round(progress)}%
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-xs text-${project.color}-600 hover:text-${project.color}-700 hover:bg-${project.color}-50 h-7 px-2`}
                            >
                              詳細 <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  すべてのプロジェクトを見る
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </TabsContent>

              {/* 活動履歴タブ */}
              <TabsContent value="activity" className="p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-stone-800">
                    環境貢献活動
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-stone-600"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    期間を選択
                  </Button>
                </div>

                {/* タイムライン */}
                <div className="relative">
                  {[
                    {
                      date: "2025/04/19",
                      title: "エコ製品定期プラン",
                      description: "環境に配慮した製品の定期購入",
                      amount: 200,
                      impact: "CO2削減: 3.2kg",
                      type: "eco",
                    },
                    {
                      date: "2025/04/15",
                      title: "レジ袋辞退",
                      description: "5回のレジ袋辞退",
                      impact: "プラスチック削減: 25g",
                      type: "action",
                    },
                    {
                      date: "2025/04/10",
                      title: "オーガニックコットン購入",
                      description: "環境配慮型商品の購入",
                      amount: 150,
                      impact: "森林保全: 0.7m²",
                      type: "eco",
                    },
                    {
                      date: "2025/04/05",
                      title: "リサイクル商品購入",
                      description: "リサイクル素材使用商品",
                      amount: 500,
                      impact: "プラスチック削減: 1.2kg",
                      type: "eco",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex gap-3 pb-4">
                      {/* タイムラインライン */}
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === "eco"
                              ? "bg-teal-100"
                              : "bg-stone-100"
                          }`}
                        >
                          <Leaf
                            className={`h-5 w-5 ${
                              activity.type === "eco"
                                ? "text-teal-600"
                                : "text-stone-600"
                            }`}
                          />
                        </div>
                        {index < 3 && (
                          <div className="absolute top-10 left-5 w-0.5 h-full bg-stone-200" />
                        )}
                      </div>

                      {/* コンテンツ */}
                      <div className="flex-1">
                        <div className="bg-white rounded-lg border border-stone-100 p-3 hover:border-stone-200 hover:shadow-sm transition-all duration-200">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium text-stone-800">
                              {activity.title}
                            </h4>
                            <span className="text-xs text-stone-500">
                              {activity.date}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mb-2">
                            {activity.description}
                          </p>
                          {activity.amount && (
                            <p className="text-sm font-semibold text-teal-600 mb-1">
                              寄付額: ¥{activity.amount}
                            </p>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              {activity.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-stone-200 hover:bg-stone-50"
                >
                  すべての活動を見る
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ランクアップ促進カード */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Medal className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-800">
                    次のランクまであと少し！
                  </h3>
                  <p className="text-xs text-stone-600">
                    エコチャンピオンまで残り¥2,550
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
              >
                詳細
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
