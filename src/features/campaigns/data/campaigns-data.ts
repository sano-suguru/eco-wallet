import { Campaign } from "../types/campaign";

/**
 * キャンペーンのモックデータ
 */
export const campaignsData: Campaign[] = [
  {
    id: "camp_1",
    title: "山の日キャンペーン",
    subtitle: "エコ製品購入で20%ポイント還元",
    description:
      "山の日を記念して、環境に優しい製品のご購入でポイント20%還元。あなたの買い物が山岳環境の保全活動を支援します。",
    type: "eco",
    startDate: "2025/05/01",
    endDate: "2025/05/31",
    imageType: "mountain",
    pointRate: 20,
    conditions: [
      "環境に配慮した商品（エコマーク付き）が対象です",
      "1回のお買い物で最大2,000ポイントまで付与されます",
      "キャンペーンポイントの有効期限は2025年6月30日までです",
    ],
    benefitDescription:
      "キャンペーン期間中、対象商品購入額の20%がEcoポイントとして還元されます。獲得したポイントは通常の買い物だけでなく、環境保全プロジェクトへの寄付にも使用できます。",
    steps: [
      "エコマーク付き商品を選ぶ",
      "Eco Walletで決済する",
      "購入額の20%がポイントとして自動付与される",
      "マイページでポイント獲得を確認",
    ],
    relatedItems: [
      {
        title: "オーガニックコットンTシャツ",
        description: "リサイクル素材を使用した環境に優しいTシャツ",
        imageType: "clothing",
      },
      {
        title: "リサイクルフリース",
        description: "ペットボトルから作られたサステナブルなフリース",
        imageType: "clothing",
      },
    ],
    ecoImpact: {
      title: "環境への貢献",
      description:
        "このキャンペーンを通じた購入は、山岳環境の保全活動に直接貢献します。",
      metrics: [
        {
          label: "森林保全面積",
          value: "約2m²",
          icon: "tree",
        },
        {
          label: "CO2削減量",
          value: "約5kg",
          icon: "globe",
        },
      ],
    },
    isActive: true,
    isPopular: true,
    badgeText: "人気",
  },
  {
    id: "camp_2",
    title: "友達紹介プログラム",
    subtitle: "友達を招待して1,000円分のエコポイントをGET",
    description:
      "友達をEco Walletに招待すると、あなたも友達も1,000円分のエコポイントが獲得できます。招待すればするほど、環境保全への貢献も大きくなります。",
    type: "referral",
    startDate: "2025/01/01",
    endDate: "2025/12/31",
    imageType: "people",
    conditions: [
      "友達が新規登録し、1回以上の決済を行うとポイントが付与されます",
      "1人の招待につき1,000ポイント付与されます（上限なし）",
      "紹介ポイントの有効期限は獲得から3ヶ月間です",
    ],
    benefitDescription:
      "友達紹介プログラムを通じて獲得したポイントは、通常のお買い物だけでなく、環境保全活動への寄付にも使用できます。",
    steps: [
      "招待リンクや招待コードを友達に共有する",
      "友達がリンクからアプリをダウンロードし新規登録する",
      "友達が初回決済を完了すると両者にポイント付与",
      "マイページで獲得ポイントを確認",
    ],
    ecoImpact: {
      title: "環境への貢献",
      description:
        "友達紹介で獲得したポイントの一部は、自動的に環境保全活動に寄付されます。",
      metrics: [
        {
          label: "森林保全貢献率",
          value: "5%",
          icon: "tree",
        },
      ],
    },
    isActive: true,
    isPopular: true,
    badgeText: "進行中",
  },
];
