"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  ArrowDown,
  ArrowUp,
  Calendar,
  Filter,
  Clock,
  AlertCircle,
  Gift,
  Info,
  Tag,
} from "lucide-react";
import { useTransactionStore } from "@/stores/slices/transaction";
import { useBalanceStore } from "@/stores/slices/balance";
import { FeaturedCampaignSection } from "@/components/campaigns/FeaturedCampaignSection";

// アイコンコンポーネント
const CreditCard = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export default function TransactionHistoryPage() {
  // Zustand ストアからデータを取得
  const transactions = useTransactionStore((state) => state.transactions);
  const balances = useBalanceStore((state) => state.campaignBalances);
  const regularBalance = useBalanceStore((state) => state.regularBalance);

  // 合計残高を計算
  const totalBalance = useBalanceStore((state) => state.getTotalBalance());

  // 環境貢献額を計算
  const totalEcoContribution = useTransactionStore((state) =>
    state.getTotalEcoContribution(),
  );

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <svg viewBox="0 0 100 40" className="h-12 w-auto fill-teal-700">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Eco Wallet
          </h1>
          <p className="text-sm text-stone-600">
            シンプルで環境に優しい決済サービス
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-teal-800">取引履歴</CardTitle>
            <CardDescription>あなたの取引と環境への貢献</CardDescription>
          </CardHeader>

          {/* 残高情報セクション */}
          <div className="px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-stone-600">総残高</div>
              <div className="text-2xl font-bold text-teal-800">
                ¥{totalBalance.toLocaleString()}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center p-2 rounded-md bg-stone-50">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-stone-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      通常残高
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-stone-800">
                  ¥{regularBalance.toLocaleString()}
                </div>
              </div>

              {balances.map((balance) => (
                <div
                  key={balance.id}
                  className="flex justify-between items-center p-2 rounded-md bg-amber-50 border border-amber-100"
                >
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 text-amber-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-stone-800">
                        {balance.label}
                      </div>
                      <div className="flex items-center text-xs text-amber-600">
                        <Clock className="h-3 w-3 mr-1" />
                        あと{balance.daysLeft}日（{balance.expiryDate}まで）
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-stone-800">
                    ¥{balance.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center mt-3 bg-teal-50 p-2 rounded-md">
              <Leaf className="h-4 w-4 text-teal-600 mr-2" />
              <div className="text-xs text-teal-700">
                あなたは今月 ¥{totalEcoContribution.toLocaleString()}{" "}
                を環境保全活動に貢献しています
              </div>
            </div>
          </div>

          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-5 h-8 bg-stone-100">
                  <TabsTrigger value="all" className="text-xs">
                    すべて
                  </TabsTrigger>
                  <TabsTrigger value="in" className="text-xs">
                    入金
                  </TabsTrigger>
                  <TabsTrigger value="out" className="text-xs">
                    支払い
                  </TabsTrigger>
                  <TabsTrigger value="campaign" className="text-xs">
                    特典
                  </TabsTrigger>
                  <TabsTrigger value="eco" className="text-xs">
                    環境貢献
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-white border-stone-200"
                >
                  <Calendar className="h-3 w-3 mr-1" /> 期間
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-white border-stone-200"
                >
                  <Filter className="h-3 w-3 mr-1" /> 絞り込み
                </Button>
              </div>
              <div className="text-xs text-stone-500">2025年4月</div>
            </div>

            <div className="space-y-2">
              {transactions.map((transaction) => (
                <Link href={`/history/${transaction.id}`} key={transaction.id}>
                  <div
                    className={`bg-white border ${
                      transaction.badges?.includes("特典") ||
                      transaction.type === "receive"
                        ? "border-amber-100"
                        : transaction.badges?.includes("期限切れ") ||
                            transaction.type === "expired"
                          ? "border-red-100"
                          : "border-stone-100"
                    } rounded-md p-3 hover:bg-stone-50 transition-colors`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "charge" ||
                            transaction.type === "receive"
                              ? "bg-blue-50 text-blue-500"
                              : transaction.badges?.includes("特典")
                                ? "bg-amber-50 text-amber-500"
                                : transaction.type === "expired" ||
                                    transaction.badges?.includes("期限切れ")
                                  ? "bg-red-50 text-red-500"
                                  : "bg-stone-50 text-stone-500"
                          }`}
                        >
                          {transaction.type === "charge" ||
                          transaction.type === "receive" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : transaction.type === "payment" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : transaction.badges?.includes("特典") ? (
                            <Gift className="h-4 w-4" />
                          ) : transaction.type === "expired" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Info className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-stone-800">
                              {transaction.description}
                            </h4>
                            {transaction.ecoContribution?.enabled && (
                              <Badge className="ml-2 bg-teal-100 text-teal-800 hover:bg-teal-200 text-xs">
                                <Leaf className="h-3 w-3 mr-1" /> 環境貢献
                              </Badge>
                            )}
                            {transaction.badges?.includes("特典") && (
                              <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs">
                                <Gift className="h-3 w-3 mr-1" /> 特典
                              </Badge>
                            )}
                            {transaction.badges?.includes("期限切れ") && (
                              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-200 text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />{" "}
                                期限切れ
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          transaction.amount < 0
                            ? "text-stone-800"
                            : transaction.type === "receive" ||
                                transaction.badges?.includes("特典")
                              ? "text-amber-600"
                              : "text-blue-600"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}¥
                        {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>

                    {transaction.type === "receive" &&
                      transaction.badges?.includes("特典") && (
                        <div className="mt-2 ml-11 text-xs bg-amber-50 rounded-md p-2 border border-amber-100">
                          <div className="flex items-center text-amber-700">
                            <Tag className="h-3 w-3 mr-1" />
                            <span className="font-medium">
                              友達紹介プログラム
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-amber-600">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>有効期限: 2025/04/30</span>
                          </div>
                        </div>
                      )}

                    {transaction.type === "expired" && (
                      <div className="mt-2 ml-11 text-xs bg-red-50 rounded-md p-2 border border-red-100">
                        <div className="flex items-center text-red-700">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span>エコポイントの残高が期限切れになりました</span>
                        </div>
                      </div>
                    )}

                    {transaction.ecoContribution?.enabled && (
                      <div className="mt-2 ml-11 text-xs text-teal-600 flex items-center">
                        <Leaf className="h-3 w-3 mr-1" />
                        うち環境保全寄付 ¥
                        {transaction.ecoContribution.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <Button
              variant="ghost"
              className="w-full text-stone-600 border border-stone-200 hover:bg-stone-50"
            >
              もっと見る
            </Button>
          </CardContent>
        </Card>

        <FeaturedCampaignSection />

        <div className="bg-teal-50 border border-teal-100 rounded-md p-3">
          <div className="flex items-start space-x-3">
            <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-teal-800">
                あなたの環境への貢献
              </h4>
              <p className="text-xs text-teal-700 mt-1">
                これまでの累計寄付額：¥12,450
              </p>
              <p className="text-xs text-teal-700 mt-1">
                あなたの取引によって保全された森林面積：5平方メートル
              </p>
              <p className="text-xs text-teal-700 mt-1">
                削減されたCO2排出量：25kg
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-stone-500">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
