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

export const newsData: NewsItem[] = [
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
    id: "news_2",
    type: "news",
    title: "海洋プラスチック削減キャンペーン開始",
    content:
      "海洋生態系を守るため、プラスチックごみの削減を目指す全国キャンペーンが開始されました。Eco Walletでは決済額の1%が自動的に本キャンペーンに寄付されます。",
    date: "2025/04/15",
    category: "ニュース",
    imageType: "ocean",
  },
];
