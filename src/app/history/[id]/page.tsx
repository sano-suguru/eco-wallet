"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Leaf,
  Share2,
  Receipt,
  ExternalLink,
  Clock,
  Gift,
} from "lucide-react";
import { useTransactionStore } from "@/stores/slices/transaction";
import { useEcoImpactStore } from "@/stores/slices/ecoImpact";
import { Transaction } from "@/lib/mock-data/transactions";
import { TransactionEcoImpact } from "@/components/eco/TransactionEcoImpact";
import { TransactionDetailSection } from "@/components/transactions/TransactionDetailSection";
import { formatCurrency } from "@/lib/utils/format";
import { getTransactionStyle } from "@/lib/utils/transaction";
import { ElectronicReceipt } from "@/components/receipts/ElectronicReceipt";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  // トランザクションストアから取引データを取得
  const getTransactionById = useTransactionStore(
    (state) => state.getTransactionById,
  );
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  // 環境貢献データを取得
  const forestArea = useEcoImpactStore((state) => state.forestArea);
  const co2Reduction = useEcoImpactStore((state) => state.co2Reduction);

  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    // 取引データの取得をシミュレート
    const fetchData = async () => {
      setLoading(true);

      try {
        // 実際のAPIリクエストの代わりにモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500)); // 遅延を追加

        const data = getTransactionById(transactionId);
        if (data) {
          setTransaction(data);
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionId, getTransactionById]);

  if (loading) {
    return (
      <PageContainer title="取引詳細" activeTab="history">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-700"></div>
        </div>
      </PageContainer>
    );
  }

  if (!transaction) {
    return (
      <PageContainer title="取引詳細" activeTab="history">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-stone-800">
            取引が見つかりませんでした
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            この取引は削除されたか、存在しません。
          </p>
          <Button
            className="mt-4 bg-teal-700 hover:bg-teal-800 text-white"
            onClick={() => router.push("/history")}
          >
            取引履歴に戻る
          </Button>
        </div>
      </PageContainer>
    );
  }

  const { type, description, date, amount } = transaction;
  // ユーティリティ関数を使用してスタイルを取得
  const style = getTransactionStyle(type, transaction.badges);

  // ユーティリティ関数を使用して金額をフォーマット
  const formattedAmount = formatCurrency(amount, {
    withPlus: true,
    withSymbol: false,
  });

  const getReceiptItems = () => {
    // 取引タイプがpaymentの場合は商品情報を生成
    if (transaction.type === "payment") {
      return [
        {
          name: transaction.description,
          quantity: 1,
          price: Math.abs(transaction.amount),
          isEco: transaction.badges?.includes("環境貢献") || false,
        },
      ];
    }
    return [];
  };

  // レシートの保存ハンドラー
  const handleDownloadReceipt = () => {
    // 実際の実装では、レシートのPDF生成やダウンロード処理を行う
    console.log("レシートをダウンロード");
  };

  // レシートの共有ハンドラー
  const handleShareReceipt = () => {
    // 実際の実装では、レシートの共有機能を提供
    if (navigator.share) {
      navigator.share({
        title: `${transaction.description}のレシート`,
        text: `${transaction.date}の取引レシート`,
        url: window.location.href,
      });
    } else {
      // 共有APIがサポートされていない場合の代替処理
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <PageContainer title="取引詳細" activeTab="history">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-600"
          onClick={() => router.push("/history")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          取引履歴に戻る
        </Button>
      </div>

      <Card className="border-0 shadow-md bg-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${style.bgColor}`}
            >
              {style.icon}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-800">
                {description}
              </h1>
              <div className="flex items-center">
                <p className="text-xs text-stone-500">{date}</p>
                {transaction.ecoContribution?.enabled && (
                  <Badge className="ml-2 bg-teal-100 text-teal-800 hover:bg-teal-200 text-xs">
                    <Leaf className="h-3 w-3 mr-1" /> 環境貢献
                  </Badge>
                )}
                {transaction.badges?.map((badge: string, index: number) => (
                  <Badge
                    key={index}
                    className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-stone-600">金額</span>
            <span className={`text-xl font-bold ${style.textColor}`}>
              {formattedAmount}
            </span>
          </div>

          <Separator className="mb-4" />

          {/* 取引詳細情報 */}
          <div className="space-y-4">
            {/* 取引情報 */}
            <TransactionDetailSection title="取引情報">
              <div className="bg-stone-50 p-3 rounded-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">取引ID</span>
                  <span className="font-mono text-stone-800">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">取引種類</span>
                  <span className="text-stone-800">
                    {type === "payment" && "支払い"}
                    {type === "charge" && "チャージ"}
                    {type === "receive" && "入金"}
                    {type === "donation" && "寄付"}
                    {type === "expired" && "期限切れ"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">日時</span>
                  <span className="text-stone-800">{date}</span>
                </div>
              </div>
            </TransactionDetailSection>

            {/* 環境貢献情報 */}
            {transaction.ecoContribution?.enabled && (
              <TransactionDetailSection
                title="環境貢献"
                icon={<Leaf className="h-4 w-4 text-teal-600" />}
              >
                <TransactionEcoImpact
                  contributionAmount={transaction.ecoContribution.amount}
                  clickable={false}
                />
              </TransactionDetailSection>
            )}

            {/* キャンペーン情報（該当する場合） */}
            {transaction.badges?.includes("特典") && (
              <TransactionDetailSection
                title="キャンペーン情報"
                icon={<Gift className="h-4 w-4 text-amber-600" />}
              >
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <div className="flex items-start space-x-3">
                    <Gift className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        特典詳細
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        友達紹介プログラムによるボーナスが付与されました。
                      </p>
                      {transaction.type === "receive" && (
                        <div className="mt-2 text-xs flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-amber-600" />
                          <span className="text-amber-700">
                            有効期限: 2025/04/30まで
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TransactionDetailSection>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              className="text-stone-600 border-stone-200"
            >
              <Receipt className="h-4 w-4 mr-2" />
              領収書
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-stone-600 border-stone-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              共有
            </Button>
          </div>
        </div>
      </Card>

      {/* 関連情報 */}
      {transaction.ecoContribution?.enabled && (
        <div className="mt-4">
          <Card className="border-0 shadow-md bg-white p-4">
            <h3 className="text-sm font-medium text-stone-800 mb-2">
              環境インパクトの詳細
            </h3>
            <p className="text-xs text-stone-600 mb-3">
              これまでの累計環境貢献
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-stone-50 p-2 rounded-md text-center">
                <p className="text-xs text-stone-600">森林保全</p>
                <p className="text-sm font-medium text-stone-800">
                  {forestArea} m²
                </p>
              </div>
              <div className="bg-stone-50 p-2 rounded-md text-center">
                <p className="text-xs text-stone-600">CO2削減</p>
                <p className="text-sm font-medium text-stone-800">
                  {co2Reduction} kg
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-teal-700 border-teal-200 hover:bg-teal-50 text-xs"
              onClick={() => router.push("/impact")}
            >
              環境貢献の詳細を見る
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Card>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          size="sm"
          className="text-stone-600 border-stone-200"
          onClick={() => setShowReceipt(true)} // レシート表示ボタン
        >
          <Receipt className="h-4 w-4 mr-2" />
          電子レシートを表示
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-stone-600 border-stone-200"
        >
          <Share2 className="h-4 w-4 mr-2" />
          共有
        </Button>
      </div>

      {/* 電子レシートダイアログ */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogTitle className="sr-only">電子レシート</DialogTitle>
        <DialogContent className="max-w-md mx-auto p-0">
          <ElectronicReceipt
            transactionId={transactionId}
            date={transaction.date}
            storeName="Eco Wallet"
            items={getReceiptItems()}
            total={Math.abs(transaction.amount)}
            paymentMethod="Eco Wallet残高"
            ecoContribution={transaction.ecoContribution}
            receiptSavings={{
              paperSaved: "約5g",
              co2Reduction: "約10g",
            }}
            onDownload={handleDownloadReceipt}
            onShare={handleShareReceipt}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
