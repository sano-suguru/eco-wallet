import { ContentItem } from "../types/eco-news";

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
  {
    id: "news_3",
    type: "news",
    title: "環境保全型農業の普及拡大",
    content:
      "化学肥料や農薬の使用を減らし、自然環境と調和した農業を推進する取り組みが全国で広がっています。Eco Walletユーザーの寄付金は、環境保全型農業を実践する農家への支援に使われます。",
    date: "2025/04/10",
    category: "ニュース",
    imageType: "forest",
  },
  {
    id: "project_3",
    type: "project",
    title: "都市緑化プロジェクト",
    description:
      "都市部の緑化を進め、ヒートアイランド現象の緩和と生物多様性の向上を目指します",
    category: "プロジェクト",
    currentFunding: 3200,
    targetFunding: 8000,
    progressPercent: 40,
    imageType: "forest",
  },
  {
    id: "news_4",
    type: "news",
    title: "再生可能エネルギー導入率が過去最高に",
    content:
      "日本の再生可能エネルギー導入率が過去最高を記録しました。太陽光発電と風力発電の普及により、CO2排出量の削減に大きく貢献しています。",
    date: "2025/04/05",
    category: "ニュース",
    imageType: "mountain",
  },
  {
    id: "project_4",
    type: "project",
    title: "絶滅危惧種保護プロジェクト",
    description: "絶滅の危機にある野生動物の保護活動と生息地の保全を行います",
    category: "プロジェクト",
    currentFunding: 5600,
    targetFunding: 12000,
    progressPercent: 47,
    imageType: "forest",
  },
];
