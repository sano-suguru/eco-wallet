import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalanceStore } from "@/features/balance/store/balance.slice";
import { formatCurrency } from "@/shared/utils/formats";

export function BalanceOverview() {
  const { regularBalance, campaignBalances, getTotalBalance } =
    useBalanceStore();

  // 合計残高を取得
  const totalBalance = getTotalBalance();

  // キャンペーン残高の合計を計算
  const campaignTotal = campaignBalances.reduce(
    (sum, campaign) => sum + campaign.amount,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>残高概要</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">合計残高</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">通常残高</p>
              <p className="text-lg font-semibold">
                {formatCurrency(regularBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">キャンペーン残高</p>
              <p className="text-lg font-semibold text-green-600">
                +{formatCurrency(campaignTotal)}
              </p>
            </div>
          </div>
          {campaignBalances.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">
                キャンペーン残高の内訳
              </p>
              <div className="space-y-1">
                {campaignBalances.map((campaign) => (
                  <div
                    key={campaign.campaignId}
                    className="flex justify-between text-sm"
                  >
                    <span>{campaign.campaignName}</span>
                    <span className="font-medium">
                      {formatCurrency(campaign.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
