"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Leaf, Clock, Gift } from "lucide-react";
import { Transaction, TransactionType } from "@/lib/mock-data/transactions";
import { useTransactionStore } from "@/stores/transactionStore";

interface RecentTransactionsProps {
  limit?: number;
}

export function RecentTransactions({ limit = 3 }: RecentTransactionsProps) {
  // Zustandストアから取引履歴データを取得
  const getRecentTransactions = useTransactionStore(
    (state) => state.getRecentTransactions,
  );
  const transactions = getRecentTransactions(limit);

  // 取引タイプに基づいてアイコンとスタイルを決定する関数
  const getTransactionStyle = (type: TransactionType) => {
    switch (type) {
      case "payment":
        return {
          icon: <ArrowUpRight className="h-5 w-5 text-red-500" />,
          bgColor: "bg-red-50",
        };
      case "charge":
        return {
          icon: <ArrowDownLeft className="h-5 w-5 text-green-500" />,
          bgColor: "bg-green-50",
        };
      case "receive":
        return {
          icon: <ArrowDownLeft className="h-5 w-5 text-blue-500" />,
          bgColor: "bg-blue-50",
        };
      case "donation":
        return {
          icon: <Leaf className="h-5 w-5 text-teal-500" />,
          bgColor: "bg-teal-50",
        };
      case "expired":
        return {
          icon: <Clock className="h-5 w-5 text-red-500" />,
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: <ArrowUpRight className="h-5 w-5 text-stone-500" />,
          bgColor: "bg-stone-50",
        };
    }
  };

  // 取引金額のフォーマット
  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    return `${isNegative ? "-" : "+"}¥${Math.abs(amount).toLocaleString()}`;
  };

  // 取引アイコンの取得
  const getTransactionIcon = (transaction: Transaction) => {
    const style = getTransactionStyle(transaction.type);

    // バッジに基づくカスタマイズ（優先順位付け）
    if (transaction.badges?.includes("期限切れ")) {
      return <Clock className="h-5 w-5 text-red-500" />;
    }

    if (transaction.badges?.includes("特典")) {
      return <Gift className="h-5 w-5 text-amber-500" />;
    }

    return style.icon;
  };

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
            const style = getTransactionStyle(transaction.type);
            const isNegative = transaction.amount < 0;
            const icon = getTransactionIcon(transaction);

            return (
              <Link
                href={`/history/${transaction.id}`}
                key={transaction.id}
                className="block hover:bg-stone-50 transition-colors"
              >
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bgColor}`}
                    >
                      {icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-stone-800">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center">
                        <p className="text-xs text-stone-500">
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
                      isNegative
                        ? "text-stone-800"
                        : transaction.type === "receive" ||
                            transaction.badges?.includes("特典")
                          ? "text-amber-600"
                          : "text-green-600"
                    }`}
                  >
                    {formatAmount(transaction.amount)}
                  </div>
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
