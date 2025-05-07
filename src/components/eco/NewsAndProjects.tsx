"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Newspaper, ExternalLink, TreePine, Droplets } from "lucide-react";
import { newsAndProjects, ContentItem } from "@/lib/mock-data/news-projects";

export function NewsAndProjects() {
  const router = useRouter();
  // 最新の2件を表示
  const latestItems = newsAndProjects.slice(0, 2);

  // 背景画像を決定する関数
  const getBackgroundImage = (item: ContentItem) => {
    // imageTypeプロパティが存在するかチェック
    if (item.imageType) {
      switch (item.imageType) {
        case "forest":
          return <TreePine className="h-12 w-12 text-teal-700 opacity-30" />;
        case "ocean":
          return <Droplets className="h-12 w-12 text-blue-500 opacity-30" />;
        case "mountain":
          return <TreePine className="h-12 w-12 text-green-700 opacity-30" />;
        default:
          return <TreePine className="h-12 w-12 text-teal-700 opacity-30" />;
      }
    }
    return <TreePine className="h-12 w-12 text-teal-700 opacity-30" />;
  };

  // バッジカラーを決定する関数
  const getBadgeColor = (item: ContentItem) => {
    if (item.type === "news") {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  // ニュース詳細ページへのナビゲーション
  const navigateToNewsDetail = (id: string) => {
    router.push(`/eco-news/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-stone-800 flex items-center">
          <Newspaper className="h-4 w-4 mr-1 text-stone-600" />
          エコニュースとプロジェクト
        </h3>
        <Link href="/eco-news">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-stone-500"
          >
            もっと見る
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {latestItems.map((item) => (
          <Card
            key={item.id}
            className="border-0 shadow-md bg-white overflow-hidden"
          >
            {item.type === "news" ? (
              <>
                <div className="aspect-[2/1] bg-teal-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getBackgroundImage(item)}
                  </div>
                </div>
                <CardContent className="p-3">
                  <Badge className={getBadgeColor(item) + " mb-2"}>
                    {item.category}
                  </Badge>
                  <h4 className="text-sm font-medium text-stone-800">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {item.content}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs text-teal-700"
                    onClick={() => navigateToNewsDetail(item.id)}
                  >
                    詳細を読む
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </>
            ) : (
              <div className="p-3">
                <Badge className={getBadgeColor(item) + " mb-2"}>
                  {item.category}
                </Badge>
                <h4 className="text-sm font-medium text-stone-800">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  {item.description}
                </p>
                <div className="mt-2 flex justify-between items-center">
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
                    className="h-1.5 w-1/2"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs border-teal-200 text-teal-700"
                  onClick={() => router.push(`/donate/${item.id}`)}
                >
                  寄付する
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
