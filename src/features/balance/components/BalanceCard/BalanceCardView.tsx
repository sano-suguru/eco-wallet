"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Send, Users, CreditCard, Plus } from "lucide-react";
import { formatCurrency } from "@/shared/utils/formats";
import { BalanceCardViewProps } from "../../types/balance";

/**
 * 残高表示と操作UIを提供するカードコンポーネント
 *
 * プレゼンテーションコンポーネントとして、残高表示とUIレイアウトを担当
 */
export const BalanceCardView = React.memo(
  ({
    formattedBalance,
    campaignTotal,
    hasExpiringBalance,
  }: BalanceCardViewProps) => {
    return (
      <Card className="border border-stone-100 shadow-sm hover:shadow-md bg-white overflow-hidden rounded-lg transition-shadow duration-200">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            現在の残高
          </p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {formattedBalance}
              </h2>
              {campaignTotal > 0 && (
                <div className="mt-2 flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <p className="text-xs font-medium">
                      キャンペーン残高:{" "}
                      {formatCurrency(campaignTotal, { withSymbol: false })}
                    </p>
                  </div>
                  {hasExpiringBalance && (
                    <span className="ml-2 text-xs bg-amber-500 text-white rounded-full px-2 py-0.5 font-medium">
                      期限間近
                    </span>
                  )}
                </div>
              )}
            </div>
            <Link href="/charge">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-lg px-4 py-2 h-9 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                チャージ
              </Button>
            </Link>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 divide-x divide-stone-100">
            <Link href="/qrcode" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-5 rounded-none h-auto w-full hover:bg-teal-50 transition-colors duration-200 group"
              >
                <QrCode className="h-6 w-6 mb-1.5 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-stone-700 font-medium">
                  支払う
                </span>
              </Button>
            </Link>
            <Link href="/transfer" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-5 rounded-none h-auto w-full hover:bg-teal-50 transition-colors duration-200 group"
              >
                <Send className="h-6 w-6 mb-1.5 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-stone-700 font-medium">送金</span>
              </Button>
            </Link>
            <Link href="/transfer?tab=split" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-5 rounded-none h-auto w-full hover:bg-teal-50 transition-colors duration-200 group"
              >
                <Users className="h-6 w-6 mb-1.5 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-stone-700 font-medium">
                  割り勘
                </span>
              </Button>
            </Link>
            <Link href="/payment" className="w-full">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-5 rounded-none h-auto w-full hover:bg-teal-50 transition-colors duration-200 group"
              >
                <CreditCard className="h-6 w-6 mb-1.5 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-stone-700 font-medium">決済</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  },
);

BalanceCardView.displayName = "BalanceCardView";
