"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  ExternalLink,
  TreePine,
  Droplets,
  Globe,
  ArrowRight,
  Calendar,
  Search,
} from "lucide-react";
import { ContentItem } from "../../types/eco-news";
import { useNewsFilter } from "../../hooks/useNewsFilter";

interface NewsListProps {
  items: ContentItem[];
}

export function NewsList({ items }: NewsListProps) {
  const router = useRouter();
  const {
    filteredItems,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  } = useNewsFilter({ items });

  // 背景グラデーションを決定する関数
  const getBackgroundGradient = (item: ContentItem) => {
    if (item.type === "news") {
      if (item.imageType === "ocean") {
        return "from-blue-600 to-blue-500";
      } else if (item.imageType === "mountain") {
        return "from-green-700 to-green-600";
      }
      return "from-teal-700 to-teal-600"; // デフォルト（forest）
    } else {
      // プロジェクトタイプ
      if (item.imageType === "ocean") {
        return "from-blue-700 to-blue-500";
      } else if (item.imageType === "mountain") {
        return "from-green-700 to-green-500";
      }
      return "from-teal-700 to-teal-500"; // デフォルト（forest）
    }
  };

  // アイコンを決定する関数
  const getItemIcon = (item: ContentItem) => {
    if (item.imageType === "ocean") {
      return <Droplets className="h-16 w-16 text-white opacity-30" />;
    } else if (item.imageType === "mountain") {
      return <TreePine className="h-16 w-16 text-white opacity-30" />;
    }
    return <TreePine className="h-16 w-16 text-white opacity-30" />;
  };

  // バッジスタイルを決定する関数
  const getBadgeStyle = (item: ContentItem) => {
    if (item.type === "news") {
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    } else {
      return "bg-green-100 text-green-800 hover:bg-green-200";
    }
  };

  // ボタンスタイルを決定する関数
  const getButtonStyle = (item: ContentItem) => {
    if (item.type === "news") {
      return "text-blue-700 border-blue-200 hover:bg-blue-50";
    } else {
      return "text-teal-700 border-teal-200 hover:bg-teal-50";
    }
  };

  // ニュース詳細ページへ遷移
  const navigateToNewsDetail = (id: string) => {
    router.push(`/eco-news/${id}`);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-stone-800 flex items-center">
            <Newspaper className="h-5 w-5 mr-2 text-teal-700" />
            エコニュースとプロジェクト
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-stone-600"
          >
            <Calendar className="h-3 w-3 mr-1" /> 期間
          </Button>
        </div>
        <p className="text-sm text-stone-600">
          環境保全に関するニュースやプロジェクトをご紹介します。持続可能な未来のために、一緒に行動しましょう。
        </p>
      </div>

      <Card className="border-0 shadow-md bg-white overflow-hidden mb-6">
        <Tabs
          value={statusFilter}
          className="w-full"
          onValueChange={(value) =>
            setStatusFilter(value as typeof statusFilter)
          }
        >
          <div className="p-4 pb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                type="text"
                placeholder="ニュースやプロジェクトを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-stone-50 border-stone-200"
              />
            </div>
          </div>

          <TabsList className="grid grid-cols-3 bg-stone-100 rounded-none border-b border-stone-200">
            <TabsTrigger
              value="all"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              すべて
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              ニュース
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className="text-xs rounded-none data-[state=active]:bg-white"
            >
              プロジェクト
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-md overflow-hidden eco-transition hover:shadow-lg"
                >
                  <div
                    className={`aspect-video bg-gradient-to-br ${getBackgroundGradient(item)} relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getItemIcon(item)}
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge className={`${getBadgeStyle(item)} mb-2`}>
                      {item.category}
                    </Badge>
                    <h3 className="text-sm font-medium text-stone-800 mb-1">
                      {item.title}
                    </h3>
                    {item.type === "news" ? (
                      <p className="text-xs text-stone-600 mb-3 line-clamp-3">
                        {item.content}
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-stone-600 mb-3">
                          {item.description}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-xs">
                            <span className="text-teal-700 font-medium">
                              ¥{item.currentFunding.toLocaleString()}
                            </span>
                            <span className="text-stone-500">
                              {" "}
                              / ¥{item.targetFunding.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={item.progressPercent}
                            className="h-1.5 w-1/2 bg-teal-100"
                          />
                        </div>
                      </>
                    )}
                    <Separator className="my-3" />
                    {item.type === "news" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full ${getButtonStyle(item)} eco-transition`}
                        onClick={() => navigateToNewsDetail(item.id)}
                      >
                        詳細を読む
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full ${getButtonStyle(item)} eco-transition`}
                        onClick={() => router.push(`/donate/${item.id}`)}
                      >
                        寄付する
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-stone-500">
                  該当する項目が見つかりませんでした。
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <div className="bg-teal-50 border border-teal-100 rounded-md p-4 mb-4">
        <div className="flex items-start space-x-3">
          <Globe className="h-5 w-5 text-teal-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-teal-800">
              環境貢献のヒント
            </h3>
            <p className="text-xs text-teal-700 mt-1">
              プロジェクトへの寄付は、エコポイントとして還元されます。また、決済時に環境保全オプションを有効にすることで、あなたの日常の買い物が地球環境の保全につながります。
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-stone-500">
        お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
      </p>
    </div>
  );
}
