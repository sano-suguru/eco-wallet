"use client";

import { PageContainer } from "@/features/layout";
import { NewsList } from "../NewsList";
import { newsAndProjects } from "../../data/eco-news-data";

export function NewsPage() {
  return (
    <PageContainer title="エコニュースとプロジェクト" activeTab="eco">
      <NewsList items={newsAndProjects} />
    </PageContainer>
  );
}
