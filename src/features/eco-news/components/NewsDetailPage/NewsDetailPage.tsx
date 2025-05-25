"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/features/layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NewsDetail } from "../NewsDetail";
import { NewsItem } from "../../types/eco-news";
import { newsAndProjects } from "../../data/eco-news-data";

export function NewsDetailPage() {
  const params = useParams();
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

  if (loading) {
    return (
      <PageContainer title="ニュース詳細" activeTab="eco">
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
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
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="ニュース詳細" activeTab="eco">
      <NewsDetail newsItem={newsItem} allItems={newsAndProjects} />
    </PageContainer>
  );
}
