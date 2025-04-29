export interface RecommendedActionItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  icon: string;
  priority: number;
}

export const recommendedActions: RecommendedActionItem[] = [
  {
    id: "action_1",
    title: "今月のおすすめアクション",
    description:
      "決済額からの環境貢献を3%に増やすと、1ヶ月で森林保全面積を約2m²追加できます。",
    actionLabel: "環境貢献を増やす",
    actionLink: "/settings?tab=eco",
    icon: "leaf",
    priority: 3,
  },
  {
    id: "action_2",
    title: "環境貢献レポートの受け取り",
    description:
      "毎月の環境貢献レポートを受け取ることで、あなたの取り組みの成果を確認できます。",
    actionLabel: "設定を変更する",
    actionLink: "/settings?tab=notifications",
    icon: "mail",
    priority: 2,
  },
  {
    id: "action_3",
    title: "友達紹介で環境保全に貢献",
    description:
      "友達を紹介すると、紹介した方も紹介された方も1,000円分のエコポイントを獲得できます。",
    actionLabel: "友達を招待する",
    actionLink: "/invite",
    icon: "users",
    priority: 1,
  },
];
