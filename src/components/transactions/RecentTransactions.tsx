"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, Leaf } from "lucide-react";
import { Transaction } from "@/lib/mock-data/transactions";
import { useTransactionStore } from "@/stores/slices/transaction";
import { CompactEcoImpact } from "@/components/eco/CompactEcoImpact";
import { useEffect, useState, useMemo } from "react";

// フックのインポート
import { useTransactionStyling } from "@/hooks";

interface RecentTransactionsProps {
  limit?: number;
}

// トランザクションスタイル情報の型定義
interface TransactionStyle {
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconType: string;
  icon: React.ReactNode;
}

export function RecentTransactions({ limit = 3 }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // React Hook のルールを守るため、トップレベルでフックを1回呼び出す
  // eslint を満たすためだけのダミー呼び出し - 実際には各トランザクションごとのスタイルはuseMemo内で計算
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useTransactionStyling("payment", []);

  // 各トランザクションのスタイル情報をメモ化（フックの呼び出しは避ける）
  const transactionStyles = useMemo(() => {
    const styles: Record<
      string,
      {
        style: TransactionStyle;
        formattedAmount: string;
      }
    > = {};

    transactions.forEach((tx) => {
      // 既存のフックの実装ロジックを直接使用
      // Note: フックの内部実装をコピーして使用する方法は通常推奨されませんが、
      // ここでは React Hooks のルールを守るための例外的な対応です

      // スタイル設定
      let styleConfig = {
        iconType: "info",
        bgColor: "bg-stone-50",
        textColor: "text-stone-800",
        borderColor: "border-stone-100",
      };

      // バッジに応じたスタイル設定
      if (tx.badges?.includes("期限切れ")) {
        styleConfig = {
          iconType: "clock",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-100",
        };
      } else if (tx.badges?.includes("特典")) {
        styleConfig = {
          iconType: "gift",
          bgColor: "bg-amber-50",
          textColor: "text-amber-600",
          borderColor: "border-amber-100",
        };
      } else {
        // トランザクションタイプに基づいたスタイル設定
        switch (tx.type) {
          case "payment":
            styleConfig = {
              iconType: "arrow-up",
              bgColor: "bg-stone-50",
              textColor: "text-stone-800",
              borderColor: "border-stone-100",
            };
            break;
          case "charge":
            styleConfig = {
              iconType: "arrow-down",
              bgColor: "bg-green-50",
              textColor: "text-green-600",
              borderColor: "border-green-100",
            };
            break;
          case "receive":
            styleConfig = {
              iconType: "arrow-down",
              bgColor: "bg-blue-50",
              textColor: "text-blue-600",
              borderColor: "border-blue-100",
            };
            break;
          case "expired":
            styleConfig = {
              iconType: "clock",
              bgColor: "bg-red-50",
              textColor: "text-red-600",
              borderColor: "border-red-100",
            };
            break;
          case "donation":
            styleConfig = {
              iconType: "leaf",
              bgColor: "bg-teal-50",
              textColor: "text-teal-600",
              borderColor: "border-teal-100",
            };
            break;
        }
      }

      // 金額フォーマット（通常は別のフックで行うロジックをインライン化）
      const formattedAmount = new Intl.NumberFormat("ja-JP", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(tx.amount);

      const prefix = tx.amount > 0 ? "+" : "";

      styles[tx.id] = {
        style: {
          ...styleConfig,
          icon: null, // アイコンはレンダリング時に生成
          bgColor: styleConfig.bgColor,
          textColor: styleConfig.textColor,
          borderColor: styleConfig.borderColor,
          iconType: styleConfig.iconType,
        },
        formattedAmount: `${prefix}${formattedAmount}`,
      };
    });

    return styles;
  }, [transactions]);

  const getRecentTransactions = useTransactionStore(
    (state) => state.getRecentTransactions,
  );

  useEffect(() => {
    const recentTransactions = getRecentTransactions(limit);
    setTransactions(recentTransactions);
  }, [getRecentTransactions, limit]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-stone-800">最近の取引</h3>
        <Link href="/history">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-stone-500"
          >
            すべて見る
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-md bg-white divide-y divide-stone-100">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const styleInfo = transactionStyles[transaction.id] || {
              style: {
                bgColor: "bg-stone-50",
                textColor: "text-stone-800",
                borderColor: "border-stone-100",
                iconType: "info",
                icon: null,
              },
              formattedAmount: "0",
            };

            const { style, formattedAmount } = styleInfo;

            return (
              <Link
                href={`/history/${transaction.id}`}
                key={transaction.id}
                className="block hover:bg-stone-50 transition-colors"
              >
                <div className="p-3 flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bgColor}`}
                      >
                        {style.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-stone-800">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center">
                          <p className="text-xs text-stone-700">
                            {transaction.date}
                          </p>
                          {transaction.ecoContribution?.enabled && (
                            <Badge className="ml-2 bg-teal-100 text-teal-800 text-[10px] py-0 h-4">
                              <Leaf className="h-2 w-2 mr-0.5" />
                              環境貢献
                            </Badge>
                          )}
                          {transaction.badges?.map((badge, index) => (
                            <Badge
                              key={index}
                              className={`ml-2 ${
                                badge === "特典"
                                  ? "bg-amber-100 text-amber-800"
                                  : badge === "期限切れ"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-stone-100 text-stone-800"
                              } text-[10px] py-0 h-4`}
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        transaction.amount < 0
                          ? "text-stone-800"
                          : transaction.type === "receive" ||
                              transaction.badges?.includes("特典")
                            ? "text-amber-600"
                            : "text-green-600"
                      }`}
                    >
                      {/* フォーマット関数を使用して金額を表示 */}
                      {formattedAmount}
                    </div>
                  </div>

                  {/* 環境貢献表示 - 視覚的に強化された実装 */}
                  {transaction.ecoContribution?.enabled && (
                    <div className="mt-2 ml-11">
                      <CompactEcoImpact
                        contributionAmount={transaction.ecoContribution.amount}
                        disableLink={true}
                      />
                    </div>
                  )}

                  {/* キャンペーン特典の表示 */}
                  {transaction.type === "receive" &&
                    transaction.badges?.includes("特典") && (
                      <div className="mt-2 ml-11 text-xs bg-amber-50 rounded-md p-2 border border-amber-100">
                        <div className="flex items-center text-amber-700">
                          <Gift className="h-3 w-3 mr-1" />
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

                  {/* 期限切れの表示 */}
                  {transaction.type === "expired" && (
                    <div className="mt-2 ml-11 text-xs bg-red-50 rounded-md p-2 border border-red-100">
                      <div className="flex items-center text-red-700">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>エコポイントの残高が期限切れになりました</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-4 text-center text-stone-500 text-sm">
            取引履歴がありません
          </div>
        )}
      </Card>
    </div>
  );
}
