import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ChargePage() {
  return (
    <div className="flex min-h-screen bg-stone-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <svg viewBox="0 0 100 40" className="h-12 w-auto fill-teal-700">
            <path d="M50,0 L75,20 L65,40 H35 L25,20 L50,0z" />
            <path d="M45,15 L55,15 L55,25 L45,25 L45,15z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Eco Wallet
          </h1>
          <p className="text-sm text-stone-600">
            シンプルで環境に優しい決済サービス
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-teal-800">チャージ</CardTitle>
            <CardDescription>
              あなたのアカウントにチャージします
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-teal-50 border-teal-200">
              <AlertDescription className="text-xs text-teal-800">
                ペーパーレス決済で、取引ごとに環境保護団体への寄付が行われます
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="credit-card" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-stone-100">
                <TabsTrigger value="credit-card" className="text-sm">
                  クレジットカード
                </TabsTrigger>
                <TabsTrigger value="bank" className="text-sm">
                  銀行振込
                </TabsTrigger>
              </TabsList>
              <TabsContent value="credit-card" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-sm font-medium text-stone-800"
                  >
                    チャージ金額
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="5,000"
                      className="border-stone-300"
                    />
                    <span className="text-sm text-stone-600">円</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-stone-600 px-1">
                  <span>おすすめ金額:</span>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
                    >
                      5,000円
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 py-0 bg-stone-100 hover:bg-teal-50 border-stone-200"
                    >
                      10,000円
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4 pt-4">
                <div className="text-sm text-stone-700 space-y-2">
                  <p>以下の口座へお振込みください:</p>
                  <div className="bg-stone-100 p-3 rounded-md text-stone-800 font-mono text-xs">
                    <div>銀行名: エコバンク</div>
                    <div>支店名: 環境支店（001）</div>
                    <div>口座番号: 12345678</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
              チャージを確定する
            </Button>
          </CardFooter>
        </Card>

        <p className="text-xs text-center text-stone-500">
          このサービスは環境に配慮した素材で作られたサーバーで運用されています
        </p>
      </div>
    </div>
  );
}
