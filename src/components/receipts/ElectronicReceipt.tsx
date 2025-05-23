"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TransactionEcoImpact } from "@/components/eco/TransactionEcoImpact";
import { formatCurrency } from "@/shared/utils/formats";
import {
  Leaf,
  Receipt,
  Download,
  Share2,
  Clock,
  Store,
  CreditCard,
} from "lucide-react";

interface Item {
  name: string;
  quantity: number;
  price: number;
  isEco?: boolean;
}

interface ElectronicReceiptProps {
  transactionId: string;
  date: string;
  storeName: string;
  items: Item[];
  total: number;
  paymentMethod: string;
  ecoContribution?: {
    enabled: boolean;
    amount: number;
  };
  receiptSavings?: {
    paperSaved: string;
    co2Reduction: string;
  };
  onDownload?: () => void;
  onShare?: () => void;
}

export function ElectronicReceipt({
  transactionId,
  date,
  storeName,
  items,
  total,
  paymentMethod,
  ecoContribution,
  receiptSavings,
  onDownload,
  onShare,
}: ElectronicReceiptProps) {
  // サブトータルの計算
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  // 環境貢献額の計算
  const ecoAmount = ecoContribution?.amount || Math.ceil(total * 0.01);

  // QRコードがスキャンされた日時のフォーマット
  const formattedDate = new Date(date).toLocaleString("ja-JP");

  useEffect(() => {
    // アナリティクスの記録やその他の副作用
    console.log("Electronic receipt viewed for transaction:", transactionId);
  }, [transactionId]);

  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden max-w-md mx-auto">
      {/* ヘッダー部分 - ブランドカラーを使用 */}
      <div className="bg-teal-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">電子レシート</h2>
            <p className="text-sm opacity-90">{formattedDate}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <Receipt className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 店舗情報 */}
      <div className="p-4 bg-stone-50 border-b border-stone-100">
        <div className="flex items-center space-x-2">
          <Store className="h-5 w-5 text-stone-600" />
          <div>
            <h3 className="text-sm font-medium text-stone-800">{storeName}</h3>
            <p className="text-xs text-stone-500">取引番号: {transactionId}</p>
          </div>
        </div>
      </div>

      {/* 商品リスト */}
      <div className="p-5 space-y-4">
        <h3 className="text-sm font-medium text-stone-800">お買い上げ商品</h3>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-stone-800">
                    {item.name}
                  </span>
                  {item.isEco && (
                    <Badge className="ml-2 bg-teal-100 text-teal-800 text-xs">
                      <Leaf className="h-3 w-3 mr-1" />
                      環境配慮
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-stone-500">
                  {formatCurrency(item.price)} × {item.quantity}
                </div>
              </div>
              <div className="text-sm font-medium text-stone-800">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        {/* 金額情報 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">小計</span>
            <span className="text-stone-800">{formatCurrency(subtotal)}</span>
          </div>

          {ecoContribution?.enabled && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">環境保全負担金</span>
              <span className="text-teal-700">{formatCurrency(ecoAmount)}</span>
            </div>
          )}

          <div className="flex justify-between font-medium pt-1">
            <span className="text-stone-800">合計</span>
            <span className="text-teal-800 text-lg">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex justify-between text-xs text-stone-500 pt-1">
            <span>お支払い方法</span>
            <div className="flex items-center">
              <CreditCard className="h-3 w-3 mr-1" />
              <span>{paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* 環境貢献情報 */}
        {ecoContribution?.enabled && (
          <div className="mt-4">
            <TransactionEcoImpact
              contributionAmount={ecoAmount}
              compact={false}
              clickable={false}
            />
          </div>
        )}

        {/* 紙レシート削減効果 */}
        {receiptSavings && (
          <div className="bg-teal-50 p-3 rounded-md border border-teal-100 mt-4">
            <div className="flex items-start space-x-3">
              <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-teal-800">
                  ペーパーレス効果
                </h4>
                <p className="text-xs text-teal-700 mt-1">
                  紙のレシートを辞退することで、{receiptSavings.paperSaved}
                  の紙資源と
                  {receiptSavings.co2Reduction}のCO2排出量を削減できました。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* タイムスタンプと有効期限 */}
      <div className="p-4 bg-stone-50 border-t border-stone-100">
        <div className="flex items-center text-xs text-stone-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>有効期限: 2026年4月30日まで</span>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="p-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 mr-2 border-stone-200 text-stone-600"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          保存する
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 ml-2 border-stone-200 text-stone-600"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          共有する
        </Button>
      </div>
    </Card>
  );
}
