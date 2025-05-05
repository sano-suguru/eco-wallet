"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, Leaf } from "lucide-react";
import { Transaction } from "@/lib/mock-data/transactions";
import { useTransactionStore } from "@/stores/transactionStore";
import { CompactEcoImpact } from "@/components/eco/CompactEcoImpact";
import { useEffect, useState } from "react";

// 追加した新しいユーティリティのインポート
import { formatCurrency } from "@/lib/utils/format";
import { getTransactionStyle } from "@/lib/utils/transaction";

interface RecentTransactionsProps {
  limit?: number;
}

export function RecentTransactions({ limit = 3 }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
            // ユーティリティ関数を使用して取引スタイルを取得
            const style = getTransactionStyle(
              transaction.type,
              transaction.badges,
            );

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
                        transaction.amount < 0
                          ? "text-stone-800"
                          : transaction.type === "receive" ||
                              transaction.badges?.includes("特典")
                            ? "text-amber-600"
                            : "text-green-600"
                      }`}
                    >
                      {/* フォーマット関数を使用して金額を表示 */}
                      {formatCurrency(transaction.amount, {
                        withPlus: true,
                        withSymbol: false,
                      })}
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
