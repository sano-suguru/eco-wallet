import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Leaf,
  UserPlus,
  Users,
  Send,
  Calculator,
  ChevronRight,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function TransferSplitPage() {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/">
            <svg viewBox="0 0 100 40" className="h-12 w-auto fill-teal-700">
              <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
              <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Eco Wallet
          </h1>
          <p className="text-sm text-stone-600">
            シンプルで環境に優しい決済サービス
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-teal-800">
                  送金・分割支払い
                </CardTitle>
                <CardDescription>
                  友人や家族への送金や割り勘を簡単に
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800">残高 ¥8,500</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="transfer" className="w-full">
              <TabsList className="grid grid-cols-2 bg-stone-100">
                <TabsTrigger value="transfer" className="text-sm">
                  <Send className="h-4 w-4 mr-2" />
                  送金
                </TabsTrigger>
                <TabsTrigger value="split" className="text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  割り勘
                </TabsTrigger>
              </TabsList>

              {/* 送金タブ */}
              <TabsContent value="transfer" className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="recipient"
                    className="text-sm font-medium text-stone-800"
                  >
                    送金先
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <Input
                      id="recipient"
                      placeholder="メールアドレス、ユーザー名、電話番号"
                      className="pl-10 border-stone-200"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 rounded-md p-3">
                  <p className="text-xs text-stone-500 mb-2">最近の送金先</p>
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                      <Avatar className="h-12 w-12 border border-stone-200">
                        <AvatarImage src="/api/placeholder/32/32" alt="田中" />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          田中
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">田中</span>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                      <Avatar className="h-12 w-12 border border-stone-200">
                        <AvatarImage src="/api/placeholder/32/32" alt="佐藤" />
                        <AvatarFallback className="bg-green-100 text-green-800">
                          佐藤
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">佐藤</span>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                      <Avatar className="h-12 w-12 border border-stone-200">
                        <AvatarImage src="/api/placeholder/32/32" alt="鈴木" />
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          鈴木
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">鈴木</span>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                      <Avatar className="h-12 w-12 border border-stone-200">
                        <AvatarImage src="/api/placeholder/32/32" alt="高橋" />
                        <AvatarFallback className="bg-amber-100 text-amber-800">
                          高橋
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">高橋</span>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                      <div className="h-12 w-12 rounded-full border border-dashed border-stone-300 flex items-center justify-center bg-white">
                        <UserPlus className="h-5 w-5 text-stone-400" />
                      </div>
                      <span className="text-xs">追加</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-sm font-medium text-stone-800"
                  >
                    金額
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1,000"
                      className="border-stone-200"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-sm text-stone-500">円</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-stone-800"
                  >
                    メッセージ（任意）
                  </Label>
                  <Input
                    id="message"
                    placeholder="ありがとう！"
                    className="border-stone-200"
                  />
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-md p-3 flex items-start space-x-3">
                  <div className="mt-0.5">
                    <Leaf className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-teal-800">
                        環境保全への貢献
                      </h3>
                      <Switch id="eco-donation" defaultChecked />
                    </div>
                    <p className="text-xs text-teal-700 mt-1">
                      この送金の1%（10円）を環境保全プロジェクトに寄付します
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">送金額</span>
                    <span className="font-medium text-stone-800">¥1,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">手数料</span>
                    <span className="font-medium text-stone-800">¥0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">環境保全寄付（1%）</span>
                    <span className="font-medium text-teal-700">¥10</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-800">合計</span>
                    <span className="text-teal-800">¥1,010</span>
                  </div>
                </div>

                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-4">
                  送金する
                </Button>
              </TabsContent>

              {/* 割り勘タブ */}
              <TabsContent value="split" className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="split-title"
                    className="text-sm font-medium text-stone-800"
                  >
                    タイトル
                  </Label>
                  <Input
                    id="split-title"
                    placeholder="山登りの費用"
                    className="border-stone-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="split-amount"
                    className="text-sm font-medium text-stone-800"
                  >
                    合計金額
                  </Label>
                  <div className="relative">
                    <Input
                      id="split-amount"
                      type="number"
                      placeholder="12,000"
                      className="border-stone-200"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-sm text-stone-500">円</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-stone-800">
                      参加者
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-teal-700"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      追加
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-teal-100 text-teal-800">
                            自分
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-stone-800">
                            あなた（山田太郎）
                          </p>
                          <p className="text-xs text-stone-500">支払い者</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          defaultValue="4000"
                          className="w-20 h-8 text-sm border-stone-200"
                        />
                        <span className="text-sm text-stone-500">円</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            田中
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-stone-800">田中 花子</p>
                          <p className="text-xs text-teal-600">
                            Eco Wallet利用者
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          defaultValue="4000"
                          className="w-20 h-8 text-sm border-stone-200"
                        />
                        <span className="text-sm text-stone-500">円</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-100 text-green-800">
                            佐藤
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-stone-800">佐藤 健太</p>
                          <div className="flex items-center">
                            <Input
                              placeholder="メールアドレスを入力"
                              className="w-full h-6 text-xs border-stone-200 py-0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          defaultValue="4000"
                          className="w-20 h-8 text-sm border-stone-200"
                        />
                        <span className="text-sm text-stone-500">円</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-stone-200"
                  >
                    <Calculator className="h-3 w-3 mr-1" />
                    均等に分ける
                  </Button>
                  <div className="text-sm">
                    <span className="text-stone-600">合計：</span>
                    <span className="font-medium text-stone-800">¥12,000</span>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-md p-3">
                  <div className="flex items-center">
                    <Checkbox
                      id="eco-receipt"
                      defaultChecked
                      className="mr-2"
                    />
                    <Label
                      htmlFor="eco-receipt"
                      className="text-sm text-teal-800"
                    >
                      電子レシートのみを使用し、紙の使用を削減します
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="split-method"
                      className="text-sm font-medium text-stone-800"
                    >
                      送金方法
                    </Label>
                    <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                      <Leaf className="h-3 w-3 mr-1" />
                      環境に優しい
                    </Badge>
                  </div>
                  <Select defaultValue="wallet">
                    <SelectTrigger className="border-stone-200">
                      <SelectValue placeholder="送金方法を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">
                        Eco Wallet（手数料無料）
                      </SelectItem>
                      <SelectItem value="bank">
                        銀行振込（手数料発生）
                      </SelectItem>
                      <SelectItem value="qr">
                        QRコード送信（手数料無料）
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">あなたの立替額</span>
                    <span className="font-medium text-stone-800">¥12,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">回収予定額</span>
                    <span className="font-medium text-stone-800">¥8,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">環境貢献額</span>
                    <span className="font-medium text-teal-700">¥120</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="text-stone-700 border-stone-200"
                  >
                    下書き保存
                  </Button>
                  <Button className="bg-teal-700 hover:bg-teal-800 text-white">
                    請求を送信
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="bg-stone-100 rounded-md p-4">
          <h3 className="text-sm font-medium text-stone-800 mb-2">
            過去の割り勘
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-stone-200 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-stone-800">
                  キャンプ用品費用
                </h4>
                <p className="text-xs text-stone-500">2025/04/10 • 3人</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-stone-800">¥18,600</p>
                <Badge className="bg-green-100 text-green-800">完了</Badge>
              </div>
            </div>

            <div className="bg-white rounded-md p-3 border border-stone-200 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-stone-800">
                  富士山登山費用
                </h4>
                <p className="text-xs text-stone-500">2025/03/15 • 4人</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-stone-800">¥24,000</p>
                <Badge className="bg-amber-100 text-amber-800">進行中</Badge>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full text-stone-600 mt-2 text-sm"
          >
            すべての履歴を見る
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <p className="text-xs text-center text-stone-500">
          お客様の送金ごとに、金額の1%を環境保護団体に寄付できます
        </p>
      </div>
    </div>
  );
}
