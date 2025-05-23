"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
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
import { newsAndProjects, NewsItem } from "@/lib/mock-data/news-projects";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // データの取得をシミュレート
    const fetchData = async () => {
      setLoading(true);

      try {
        // 実際のAPIリクエストの代わりにモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 300)); // 遅延を追加

        const item = newsAndProjects.find(
          (item) => item.id === newsId && item.type === "news",
        ) as NewsItem | undefined;

        setNewsItem(item || null);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [newsId]);

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
    // 実際のアプリではシェア機能を実装
    // Web Share APIが利用可能な場合はそれを使用
    if (navigator.share) {
      navigator
        .share({
          title: newsItem?.title || "Eco Walletニュース",
          text: newsItem?.content || "",
          url: window.location.href,
        })
        .catch((err) => {
          // ユーザーがキャンセルした場合は何もしない（正常な動作）
          if (err.name === "AbortError" || err.message === "Share canceled") {
            return;
          }
          // その他のエラーの場合のみログ出力
          console.error("共有に失敗しました", err);
        });
    } else {
      // クリップボードにURLをコピー
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("URLをコピーしました"))
        .catch((err) =>
          console.error("クリップボードへのコピーに失敗しました", err),
        );
    }
  };

  if (loading) {
    return (
      <PageContainer title="ニュース詳細" activeTab="eco">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-700"></div>
        </div>
      </PageContainer>
    );
  }

  if (!newsItem) {
    return (
      <PageContainer title="ニュース詳細" activeTab="eco">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-stone-800">
            ニュースが見つかりませんでした
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            このニュースは削除されたか、存在しません。
          </p>
          <Button
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white"
            onClick={() => router.push("/eco-news")}
          >
            ニュース一覧に戻る
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="ニュース詳細" activeTab="eco">
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
            {/* 共有ボタンをデザインガイドラインに沿ったスタイルに修正 */}
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
          <div className="bg-stone-50 rounded-md p-4 mt-4">
            <h3 className="text-sm font-medium text-stone-800 mb-2">
              関連ニュース
            </h3>
            <div className="space-y-2">
              {newsAndProjects
                .filter(
                  (item) =>
                    item.type === "news" &&
                    item.id !== newsItem.id &&
                    item.category === newsItem.category,
                )
                .slice(0, 2)
                .map((relatedNews) => {
                  // NewsItem型であることを保証
                  const newsItem = relatedNews as NewsItem;
                  return (
                    <Button
                      key={newsItem.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 border-stone-200"
                      onClick={() => router.push(`/eco-news/${newsItem.id}`)}
                    >
                      <div>
                        <div className="text-sm font-medium text-stone-800">
                          {newsItem.title}
                        </div>
                        <div className="text-xs text-stone-500">
                          {newsItem.date}
                        </div>
                      </div>
                    </Button>
                  );
                })}
            </div>
          </div>
        </div>
      </Card>

      {/* 下部のボタン - 重複を避けるため、環境貢献するボタンは上部のみに配置し、
           ここではニュース一覧に戻るボタンのみを表示する */}
      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          className="border-stone-200 text-stone-600"
          onClick={() => router.push("/eco-news")}
        >
          ニュース一覧に戻る
        </Button>
      </div>
    </PageContainer>
  );
}
