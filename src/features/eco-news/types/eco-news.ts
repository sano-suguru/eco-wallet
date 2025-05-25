export type ContentType = "news" | "project";
export type ImageType = "forest" | "ocean" | "mountain" | "default";

export interface NewsItem {
  id: string;
  type: "news";
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  imageType?: ImageType;
  category: string;
  externalLink?: string;
}

export interface ProjectItem {
  id: string;
  type: "project";
  title: string;
  description: string;
  category: string;
  currentFunding: number;
  targetFunding: number;
  progressPercent: number;
  imageUrl?: string;
  imageType?: ImageType;
  externalLink?: string;
}

export type ContentItem = NewsItem | ProjectItem;

export type StatusFilter = "all" | "news" | "project";

export interface NewsFilterState {
  status: StatusFilter;
  searchQuery: string;
  category?: string;
}
