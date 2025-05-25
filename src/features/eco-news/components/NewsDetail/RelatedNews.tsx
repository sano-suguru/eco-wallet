"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewsItem } from "../../types/eco-news";

interface RelatedNewsProps {
  currentNewsId: string;
  category: string;
  allNews: NewsItem[];
}

export function RelatedNews({
  currentNewsId,
  category,
  allNews,
}: RelatedNewsProps) {
  const router = useRouter();

  const relatedNews = allNews
    .filter(
      (item) =>
        item.type === "news" &&
        item.id !== currentNewsId &&
        item.category === category,
    )
    .slice(0, 2);

  if (relatedNews.length === 0) {
    return null;
  }

  return (
    <div className="bg-stone-50 rounded-md p-4 mt-4">
      <h3 className="text-sm font-medium text-stone-800 mb-2">関連ニュース</h3>
      <div className="space-y-2">
        {relatedNews.map((news) => (
          <Button
            key={news.id}
            variant="outline"
            className="w-full justify-start text-left h-auto py-2 border-stone-200"
            onClick={() => router.push(`/eco-news/${news.id}`)}
          >
            <div>
              <div className="text-sm font-medium text-stone-800">
                {news.title}
              </div>
              <div className="text-xs text-stone-500">{news.date}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
