"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Send, Users, CreditCard, Plus } from "lucide-react";
import { formatCurrency } from "@/shared/utils/formats";

// 残高表示とUIレイアウトを担当するコンポーネント
interface BalanceCardViewProps {
  formattedBalance: string;
  campaignTotal: number;
  hasExpiringBalance: boolean;
}

const BalanceCardView = React.memo(
  ({
    formattedBalance,
    campaignTotal,
    hasExpiringBalance,
  }: BalanceCardViewProps) => {
    return (
      <Card className="border-0 shadow-md bg-white overflow-hidden rounded-lg">
        <div className="bg-teal-600 p-5 text-white">
          <p className="text-xs opacity-80 font-medium">現在の残高</p>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold mt-1">{formattedBalance}</h2>
              {campaignTotal > 0 && (
                <p className="text-xs opacity-90 mt-1">
                  うちキャンペーン残高:{" "}
                  {formatCurrency(campaignTotal, { withSymbol: false })}
                  {hasExpiringBalance && (
                    <span className="ml-1 text-amber-100">
                      （期限間近あり）
                    </span>
                  )}
                </p>
              )}
            </div>
            <Link href="/charge">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-md px-4 py-2 h-9"
              >
                チャージ
                <Plus className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 divide-x divide-stone-100">
            <Link href="/qrcode" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-4 rounded-none h-auto w-full"
              >
                <QrCode className="h-5 w-5 mb-1 text-teal-600" />
                <span className="text-xs">支払う</span>
              </Button>
            </Link>
            <Link href="/transfer" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-4 rounded-none h-auto w-full"
              >
                <Send className="h-5 w-5 mb-1 text-teal-600" />
                <span className="text-xs">送金</span>
              </Button>
            </Link>
            <Link href="/transfer?tab=split" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-4 rounded-none h-auto w-full"
              >
                <Users className="h-5 w-5 mb-1 text-teal-600" />
                <span className="text-xs">割り勘</span>
              </Button>
            </Link>
            <Link href="/payment" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-4 rounded-none h-auto w-full"
              >
                <CreditCard className="h-5 w-5 mb-1 text-teal-600" />
                <span className="text-xs">決済</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  },
);

BalanceCardView.displayName = "BalanceCardView";

export default BalanceCardView;
