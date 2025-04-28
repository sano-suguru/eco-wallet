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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Leaf,
  Bell,
  Lock,
  CreditCard,
  ChevronRight,
  Upload,
  MapPin,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <svg viewBox="0 0 100 40" className="h-8 w-auto fill-teal-700">
                <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
                <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Eco Wallet
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* プロフィールカード */}
          <Card className="sm:w-1/3 border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border-2 border-teal-100">
                  <AvatarImage
                    src={user?.image || "/api/placeholder/100/100"}
                    alt="プロフィール画像"
                  />
                  <AvatarFallback className="bg-teal-100 text-teal-800">
                    {user?.name ? user.name.slice(0, 2) : "山田"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs text-stone-600"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  画像を変更
                </Button>
                <h2 className="mt-3 text-lg font-medium text-stone-900">
                  {user?.name || "山田 太郎"}
                </h2>
                <p className="text-sm text-stone-600">
                  {user?.email || "eco_user@example.com"}
                </p>

                <div className="mt-4 w-full">
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 w-full flex items-center py-1.5">
                    <Leaf className="h-3 w-3 mr-1" />
                    {user?.ecoRank || "エコマイスター"}
                  </Badge>
                </div>

                <div className="mt-6 w-full text-left">
                  <h3 className="text-sm font-medium text-stone-800 mb-2">
                    環境貢献状況
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">累計寄付額</span>
                      <span className="font-medium text-teal-700">¥12,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">森林保全面積</span>
                      <span className="font-medium text-teal-700">5.2 m²</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">削減CO2</span>
                      <span className="font-medium text-teal-700">25 kg</span>
                    </div>
                  </div>

                  <Link href="/impact">
                    <Button className="w-full mt-4 text-xs text-teal-700 border border-teal-200 bg-white hover:bg-teal-50">
                      環境インパクト詳細
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 設定タブカード */}
          <Card className="sm:w-2/3 border-0 shadow-md bg-white">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg text-stone-900">
                アカウント設定
              </CardTitle>
              <CardDescription>個人情報や環境設定を管理します</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-5 bg-stone-100 rounded-none border-b border-stone-200">
                  <TabsTrigger
                    value="profile"
                    className="text-xs rounded-none data-[state=active]:bg-white"
                  >
                    <User className="h-3 w-3 mr-1" />
                    プロフィール
                  </TabsTrigger>
                  <TabsTrigger
                    value="eco"
                    className="text-xs rounded-none data-[state=active]:bg-white"
                  >
                    <Leaf className="h-3 w-3 mr-1" />
                    環境設定
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="text-xs rounded-none data-[state=active]:bg-white"
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    通知
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="text-xs rounded-none data-[state=active]:bg-white"
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    支払い
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="text-xs rounded-none data-[state=active]:bg-white"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    セキュリティ
                  </TabsTrigger>
                </TabsList>

                {/* プロフィール設定 */}
                <TabsContent value="profile" className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-stone-800"
                    >
                      氏名
                    </Label>
                    <Input
                      id="name"
                      defaultValue="山田 太郎"
                      className="border-stone-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-stone-800"
                    >
                      メールアドレス
                    </Label>
                    <Input
                      id="email"
                      defaultValue="eco_user@example.com"
                      className="border-stone-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-stone-800"
                    >
                      電話番号
                    </Label>
                    <Input
                      id="phone"
                      defaultValue="090-1234-5678"
                      className="border-stone-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium text-stone-800"
                    >
                      お住まいの地域
                    </Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-stone-400" />
                      <Select defaultValue="tokyo">
                        <SelectTrigger className="border-stone-200">
                          <SelectValue placeholder="地域を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hokkaido">北海道</SelectItem>
                          <SelectItem value="tohoku">東北</SelectItem>
                          <SelectItem value="kanto">関東</SelectItem>
                          <SelectItem value="tokyo">東京</SelectItem>
                          <SelectItem value="chubu">中部</SelectItem>
                          <SelectItem value="kansai">関西</SelectItem>
                          <SelectItem value="chugoku">中国</SelectItem>
                          <SelectItem value="shikoku">四国</SelectItem>
                          <SelectItem value="kyushu">九州</SelectItem>
                          <SelectItem value="okinawa">沖縄</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
                    変更を保存
                  </Button>
                </TabsContent>

                {/* 環境設定 */}
                <TabsContent value="eco" className="p-6 space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-stone-800">
                      環境貢献の優先順位
                    </h3>
                    <RadioGroup defaultValue="forest" className="space-y-3">
                      <div className="flex items-start space-x-3 bg-stone-50 p-3 rounded-md">
                        <RadioGroupItem
                          value="forest"
                          id="forest"
                          className="mt-1"
                        />
                        <div>
                          <Label
                            htmlFor="forest"
                            className="text-sm font-medium text-stone-800"
                          >
                            森林保全を優先
                          </Label>
                          <p className="text-xs text-stone-600 mt-1">
                            寄付金は主に山岳地域の森林保全活動に使用されます
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-stone-50 p-3 rounded-md">
                        <RadioGroupItem
                          value="ocean"
                          id="ocean"
                          className="mt-1"
                        />
                        <div>
                          <Label
                            htmlFor="ocean"
                            className="text-sm font-medium text-stone-800"
                          >
                            海洋保全を優先
                          </Label>
                          <p className="text-xs text-stone-600 mt-1">
                            寄付金は主に海洋プラスチック削減と海岸の清掃活動に使用されます
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 bg-stone-50 p-3 rounded-md">
                        <RadioGroupItem
                          value="climate"
                          id="climate"
                          className="mt-1"
                        />
                        <div>
                          <Label
                            htmlFor="climate"
                            className="text-sm font-medium text-stone-800"
                          >
                            気候変動対策を優先
                          </Label>
                          <p className="text-xs text-stone-600 mt-1">
                            寄付金は主に再生可能エネルギー促進とCO2削減活動に使用されます
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-stone-800">
                      環境貢献オプション
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="eco-option1"
                          className="text-sm text-stone-800"
                        >
                          決済時の寄付オプションを常に有効化
                        </Label>
                        <p className="text-xs text-stone-500">
                          決済額の1%が自動的に環境保全に寄付されます
                        </p>
                      </div>
                      <Switch id="eco-option1" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="eco-option2"
                          className="text-sm text-stone-800"
                        >
                          紙のレシートを辞退
                        </Label>
                        <p className="text-xs text-stone-500">
                          電子レシートのみを受け取ります
                        </p>
                      </div>
                      <Switch id="eco-option2" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="eco-option3"
                          className="text-sm text-stone-800"
                        >
                          環境貢献レポートを受け取る
                        </Label>
                        <p className="text-xs text-stone-500">
                          月に一度、あなたの環境貢献の詳細レポートを受け取ります
                        </p>
                      </div>
                      <Switch id="eco-option3" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="eco-option4"
                          className="text-sm text-stone-800"
                        >
                          環境関連のお知らせを優先表示
                        </Label>
                        <p className="text-xs text-stone-500">
                          環境保全活動に関する最新情報を優先的に受け取ります
                        </p>
                      </div>
                      <Switch id="eco-option4" defaultChecked />
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-100 rounded-md p-3 mt-4">
                    <div className="flex items-start space-x-3">
                      <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-teal-800">
                          環境貢献をさらに高める
                        </h4>
                        <p className="text-xs text-teal-700 mt-1">
                          決済額からの寄付比率を増やすことで、より大きな環境インパクトを生み出せます
                        </p>
                        <Select defaultValue="1">
                          <SelectTrigger className="mt-2 border-teal-200 bg-white">
                            <SelectValue placeholder="寄付比率を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1% (デフォルト)</SelectItem>
                            <SelectItem value="3">3%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
                    設定を保存
                  </Button>
                </TabsContent>

                {/* 通知設定 */}
                <TabsContent value="notifications" className="p-6 space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-stone-800">
                      通知設定
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="notify1"
                          className="text-sm text-stone-800"
                        >
                          取引通知
                        </Label>
                        <p className="text-xs text-stone-500">
                          入金・支払い時に通知を受け取ります
                        </p>
                      </div>
                      <Switch id="notify1" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="notify2"
                          className="text-sm text-stone-800"
                        >
                          環境貢献通知
                        </Label>
                        <p className="text-xs text-stone-500">
                          あなたの環境貢献が特定のマイルストーンに達した際に通知します
                        </p>
                      </div>
                      <Switch id="notify2" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="notify3"
                          className="text-sm text-stone-800"
                        >
                          キャンペーン情報
                        </Label>
                        <p className="text-xs text-stone-500">
                          環境保全キャンペーンやイベントの情報を受け取ります
                        </p>
                      </div>
                      <Switch id="notify3" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="notify4"
                          className="text-sm text-stone-800"
                        >
                          セキュリティ通知
                        </Label>
                        <p className="text-xs text-stone-500">
                          ログインやアカウント変更時に通知を受け取ります
                        </p>
                      </div>
                      <Switch id="notify4" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label
                      htmlFor="notify-email"
                      className="text-sm font-medium text-stone-800"
                    >
                      通知メールアドレス
                    </Label>
                    <Input
                      id="notify-email"
                      defaultValue="eco_user@example.com"
                      className="border-stone-200"
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      通知の受信に使用するメールアドレスです
                    </p>
                  </div>

                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
                    設定を保存
                  </Button>
                </TabsContent>

                {/* 支払い設定 */}
                <TabsContent value="payment" className="p-6 space-y-4">
                  <h3 className="text-sm font-medium text-stone-800">
                    支払い方法
                  </h3>

                  <div className="space-y-3">
                    <div className="border border-stone-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-stone-800">
                              VISAカード
                            </h4>
                            <p className="text-xs text-stone-500">
                              **** **** **** 4567
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                          デフォルト
                        </Badge>
                      </div>
                    </div>

                    <div className="border border-stone-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-stone-800">
                              MASTERカード
                            </h4>
                            <p className="text-xs text-stone-500">
                              **** **** **** 8901
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-stone-500"
                        >
                          編集
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-stone-700 border-stone-200 mt-2"
                  >
                    新しい支払い方法を追加
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-stone-800">
                      チャージ設定
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="auto-charge"
                          className="text-sm text-stone-800"
                        >
                          自動チャージ
                        </Label>
                        <p className="text-xs text-stone-500">
                          残高が指定額以下になると自動的にチャージされます
                        </p>
                      </div>
                      <Switch id="auto-charge" />
                    </div>

                    <div className="flex space-x-3 mt-3">
                      <div className="w-1/2">
                        <Label
                          htmlFor="min-balance"
                          className="text-xs text-stone-600"
                        >
                          チャージ実行残高
                        </Label>
                        <div className="flex items-center">
                          <Input
                            id="min-balance"
                            defaultValue="1000"
                            className="border-stone-200"
                            disabled
                          />
                          <span className="ml-1 text-sm text-stone-600">
                            円以下
                          </span>
                        </div>
                      </div>
                      <div className="w-1/2">
                        <Label
                          htmlFor="charge-amount"
                          className="text-xs text-stone-600"
                        >
                          チャージ金額
                        </Label>
                        <div className="flex items-center">
                          <Input
                            id="charge-amount"
                            defaultValue="5000"
                            className="border-stone-200"
                            disabled
                          />
                          <span className="ml-1 text-sm text-stone-600">
                            円
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-2">
                    設定を保存
                  </Button>
                </TabsContent>

                {/* セキュリティ設定 */}
                <TabsContent value="security" className="p-6 space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-stone-800">
                      パスワード変更
                    </h3>

                    <div className="space-y-2">
                      <Label
                        htmlFor="current-password"
                        className="text-sm text-stone-800"
                      >
                        現在のパスワード
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="border-stone-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-sm text-stone-800"
                      >
                        新しいパスワード
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="border-stone-200"
                      />
                      <p className="text-xs text-stone-500 mt-1">
                        8文字以上で、数字と記号を含めてください
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-sm text-stone-800"
                      >
                        新しいパスワード（確認）
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="border-stone-200"
                      />
                    </div>

                    <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                      パスワードを変更
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-stone-800">
                      二段階認証
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa" className="text-sm text-stone-800">
                          二段階認証を有効化
                        </Label>
                        <p className="text-xs text-stone-500">
                          ログイン時に確認コードが必要になります
                        </p>
                      </div>
                      <Switch id="2fa" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="biometric"
                          className="text-sm text-stone-800"
                        >
                          生体認証
                        </Label>
                        <p className="text-xs text-stone-500">
                          指紋または顔認証でログインできます
                        </p>
                      </div>
                      <Switch id="biometric" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-stone-800">
                      デバイス管理
                    </h3>

                    <div className="border border-stone-200 rounded-md p-3 bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-stone-800">
                            iPhone 13 Pro
                          </h4>
                          <p className="text-xs text-stone-500">
                            最終ログイン: 2025/04/20 10:23
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          現在のデバイス
                        </Badge>
                      </div>
                    </div>

                    <div className="border border-stone-200 rounded-md p-3 bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-stone-800">
                            MacBook Pro
                          </h4>
                          <p className="text-xs text-stone-500">
                            最終ログイン: 2025/04/19 18:45
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-red-500"
                        >
                          解除
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-200 hover:bg-red-50 mt-4"
                  >
                    すべてのデバイスからログアウト
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-center text-stone-500 mt-6">
          お客様の購入ごとに、売上の1%を環境保護団体に寄付しています
        </p>
      </div>
    </div>
  );
}
