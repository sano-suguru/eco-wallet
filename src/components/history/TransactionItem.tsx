"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ArrowDown,
  ArrowUp,
  Clock,
  AlertCircle,
  Gift,
  Info,
  Tag,
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  badges?: string[];
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <Link href={`/history/${transaction.id}`} key={transaction.id}>
      <div
        className={`bg-white border shadow-sm ${
          transaction.badges?.includes("特典") || transaction.type === "receive"
            ? "border-amber-200"
            : transaction.badges?.includes("期限切れ") ||
                transaction.type === "expired"
              ? "border-red-200"
              : "border-stone-200"
        } rounded-lg p-4 hover:bg-stone-50 transition-colors`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === "charge" || transaction.type === "receive"
                  ? "bg-blue-50 text-blue-600"
                  : transaction.badges?.includes("特典")
                    ? "bg-amber-50 text-amber-600"
                    : transaction.type === "expired" ||
                        transaction.badges?.includes("期限切れ")
                      ? "bg-red-50 text-red-600"
                      : "bg-stone-50 text-stone-600"
              }`}
            >
              {transaction.type === "charge" ||
              transaction.type === "receive" ? (
                <ArrowDown className="h-5 w-5" />
              ) : transaction.type === "payment" ? (
                <ArrowUp className="h-5 w-5" />
              ) : transaction.badges?.includes("特典") ? (
                <Gift className="h-5 w-5" />
              ) : transaction.type === "expired" ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Info className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2">
                <h4 className="text-sm font-medium text-stone-800">
                  {transaction.description}
                </h4>
                {transaction.ecoContribution?.enabled && (
                  <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 text-xs border border-teal-200">
                    <Leaf className="h-3 w-3 mr-1" /> 環境貢献
                  </Badge>
                )}
                {transaction.badges?.includes("特典") && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs border border-amber-200">
                    <Gift className="h-3 w-3 mr-1" /> 特典
                  </Badge>
                )}
                {transaction.badges?.includes("期限切れ") && (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-200 text-xs border border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" /> 期限切れ
                  </Badge>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">{transaction.date}</p>
            </div>
          </div>
          <div
            className={`text-base font-medium ${
              transaction.amount < 0
                ? "text-stone-700"
                : transaction.type === "receive" ||
                    transaction.badges?.includes("特典")
                  ? "text-amber-700"
                  : "text-blue-700"
            }`}
          >
            {transaction.amount < 0 ? "-" : "+"}¥
            {Math.abs(transaction.amount).toLocaleString()}
          </div>
        </div>

        {transaction.type === "receive" &&
          transaction.badges?.includes("特典") && (
            <div className="mt-3 ml-12 text-xs bg-amber-50 rounded-md p-3 border border-amber-200">
              <div className="flex items-center text-amber-700">
                <Tag className="h-4 w-4 mr-2" />
                <span className="font-medium">友達紹介プログラム</span>
              </div>
              <div className="flex items-center mt-2 text-amber-700">
                <Clock className="h-4 w-4 mr-2" />
                <span>有効期限: 2025/04/30</span>
              </div>
            </div>
          )}

        {transaction.type === "expired" && (
          <div className="mt-3 ml-12 text-xs bg-red-50 rounded-md p-3 border border-red-200">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>エコポイントの残高が期限切れになりました</span>
            </div>
          </div>
        )}

        {transaction.ecoContribution?.enabled && (
          <div className="mt-3 ml-12 text-xs bg-teal-50 p-3 rounded-md border border-teal-200">
            <div className="flex items-center text-teal-700">
              <Leaf className="h-4 w-4 mr-2" />
              <span className="font-medium">環境保全寄付</span>
              <span className="ml-2 font-medium">
                ¥{transaction.ecoContribution.amount.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default TransactionItem;
