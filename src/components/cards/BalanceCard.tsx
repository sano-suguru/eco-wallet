"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Send, Users, CreditCard, Plus } from "lucide-react";
import { useBalanceStore } from "@/stores/balanceStore";
import { formatCurrency } from "@/lib/utils/format";

export function BalanceCard() {
  const balance = useBalanceStore((state) => state.balance);
  const campaignBalances = useBalanceStore((state) => state.campaignBalances);

  const campaignTotal = campaignBalances.reduce(
    (sum, cb) => sum + cb.amount,
    0,
  );

  const formattedBalance = formatCurrency(balance);

  // 期限が近い（7日以内）キャンペーン残高があるかチェック
  const hasExpiringBalance = campaignBalances.some((cb) => cb.daysLeft <= 7);

  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 p-5 text-white">
        <p className="text-xs opacity-80">現在の残高</p>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mt-1">{formattedBalance}</h2>
            {campaignTotal > 0 && (
              <p className="text-xs opacity-90 mt-1">
                うちキャンペーン残高:{" "}
                {formatCurrency(campaignTotal, { withSymbol: false })}
                {hasExpiringBalance && (
                  <span className="ml-1 text-amber-200">（期限間近あり）</span>
                )}
              </p>
            )}
          </div>
          <Link href="/charge">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
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
              <QrCode className="h-5 w-5 mb-1 text-teal-700" />
              <span className="text-xs">支払う</span>
            </Button>
          </Link>
          <Link href="/transfer" className="w-full">
            <Button
              variant="ghost"
              className="flex flex-col items-center py-4 rounded-none h-auto w-full"
            >
              <Send className="h-5 w-5 mb-1 text-teal-700" />
              <span className="text-xs">送金</span>
            </Button>
          </Link>
          <Link href="/transfer?tab=split" className="w-full">
            <Button
              variant="ghost"
              className="flex flex-col items-center py-4 rounded-none h-auto w-full"
            >
              <Users className="h-5 w-5 mb-1 text-teal-700" />
              <span className="text-xs">割り勘</span>
            </Button>
          </Link>
          <Link href="/payment" className="w-full">
            <Button
              variant="ghost"
              className="flex flex-col items-center py-4 rounded-none h-auto w-full"
            >
              <CreditCard className="h-5 w-5 mb-1 text-teal-700" />
              <span className="text-xs">決済</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
