"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Leaf,
  TreePine,
  Droplets,
} from "lucide-react";
import { NewsItem, ContentItem } from "../../types/eco-news";
import { RelatedNews } from "./RelatedNews";

interface NewsDetailProps {
  newsItem: NewsItem;
  allItems: ContentItem[];
}

export function NewsDetail({ newsItem, allItems }: NewsDetailProps) {
  const router = useRouter();

  // 背景アイコンを決定する関数
  const getBackgroundIcon = (imageType?: string) => {
    switch (imageType) {
      case "ocean":
        return <Droplets className="h-24 w-24 text-blue-500 opacity-30" />;
      case "mountain":
        return <TreePine className="h-24 w-24 text-green-700 opacity-30" />;
      case "forest":
      default:
        return <TreePine className="h-24 w-24 text-teal-700 opacity-30" />;
    }
  };

  // 背景色を決定する関数
  const getBackgroundGradient = (imageType?: string) => {
    switch (imageType) {
      case "ocean":
        return "from-blue-600 to-blue-500";
      case "mountain":
        return "from-green-700 to-green-600";
      case "forest":
      default:
        return "from-teal-700 to-teal-600";
    }
  };

  // 共有機能
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: newsItem.title || "Eco Walletニュース",
          text: newsItem.content || "",
          url: window.location.href,
        })
        .catch((err) => {
          if (err.name === "AbortError" || err.message === "Share canceled") {
            return;
          }
          console.error("共有に失敗しました", err);
        });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("URLをコピーしました"))
        .catch((err) =>
          console.error("クリップボードへのコピーに失敗しました", err),
        );
    }
  };

  const allNewsItems = allItems.filter(
    (item): item is NewsItem => item.type === "news",
  );

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
      </div>

      <Card className="border-0 shadow-md bg-white overflow-hidden">
        {/* ヘッダー画像エリア */}
        <div
          className={`bg-gradient-to-r ${getBackgroundGradient(newsItem.imageType)} p-6 text-white`}
        >
          <div className="flex items-center justify-center py-6">
            {getBackgroundIcon(newsItem.imageType)}
          </div>
          <h1 className="text-xl font-semibold">{newsItem.title}</h1>
          <div className="flex items-center mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">{newsItem.date}</span>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Badge className="bg-blue-100 text-blue-800">
              {newsItem.category}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-stone-600 border border-stone-200"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3 mr-1" />
              共有
            </Button>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">
              {newsItem.content}
            </p>
          </div>

          <Separator className="my-4" />

          {/* 環境貢献情報 */}
          <div className="bg-teal-50 border border-teal-100 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-teal-800">
                  あなたにできること
                </h3>
                <p className="text-xs text-teal-700 mt-1">
                  Eco Walletを使って環境保全プロジェクトに寄付することで、
                  このニュースで取り上げられている環境問題の解決に貢献できます。
                  また、日々の買い物で環境に配慮した商品を選ぶことも大切な一歩です。
                </p>
                <div className="flex justify-end mt-2">
                  <Button
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
                    onClick={() => router.push("/impact")}
                  >
                    環境貢献する
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 関連ニュース */}
          <RelatedNews
            currentNewsId={newsItem.id}
            category={newsItem.category}
            allNews={allNewsItems}
          />
        </div>
      </Card>

      {/* 下部のボタン */}
      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          className="border-stone-200 text-stone-600"
          onClick={() => router.push("/eco-news")}
        >
          ニュース一覧に戻る
        </Button>
      </div>
    </div>
  );
}
