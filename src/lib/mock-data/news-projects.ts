export type ContentType = "news" | "project";
export type ImageType = "forest" | "ocean" | "mountain" | "default";

export interface NewsItem {
  id: string;
  type: "news";
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  imageType?: ImageType; // imageTypeプロパティを追加
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
  imageType?: ImageType; // imageTypeプロパティを追加
  externalLink?: string;
}

export type ContentItem = NewsItem | ProjectItem;

export const newsAndProjects: ContentItem[] = [
  {
    id: "news_1",
    type: "news",
    title: "富士山のトレイル修復プロジェクト始動",
    content:
      "登山人気の高まりで損傷が進んだ富士山のトレイルを持続可能な方法で修復するプロジェクトが始動しました。このプロジェクトではEco Walletユーザーからの寄付も活用されます。",
    date: "2025/04/20",
    category: "ニュース",
    imageType: "forest",
  },
  {
    id: "project_1",
    type: "project",
    title: "山岳環境保全プロジェクト",
    description: "登山道の整備や森林再生などを通じて山岳環境の保全を目指します",
    category: "プロジェクト",
    currentFunding: 4500,
    targetFunding: 10000,
    progressPercent: 45,
    imageType: "mountain",
  },
  {
    id: "news_2",
    type: "news",
    title: "海洋プラスチック削減キャンペーン開始",
    content:
      "海洋生態系を守るため、プラスチックごみの削減を目指す全国キャンペーンが開始されました。Eco Walletでは決済額の1%が自動的に本キャンペーンに寄付されます。",
    date: "2025/04/15",
    category: "ニュース",
    imageType: "ocean",
  },
  {
    id: "project_2",
    type: "project",
    title: "海洋プラスチック削減イニシアチブ",
    description:
      "海洋プラスチックの削減と海岸の清掃活動を通じて海の生態系を守ります",
    category: "プロジェクト",
    currentFunding: 7950,
    targetFunding: 15000,
    progressPercent: 53,
    imageType: "ocean",
  },
];
