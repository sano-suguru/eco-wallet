"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Users,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function InvitePage() {
  const { data: session } = useSession();
  const [, setActiveTab] = useState("link");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // 招待リンク（実際の実装ではAPIから取得するか、ユーザーIDに基づいて生成）
  const inviteLink = `https://ecowallet.example.com/register?ref=${session?.user.id || "demo"}`;

  // 招待コード（実際の実装ではAPIから取得）
  const inviteCode =
    "ECO" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

  // リンクをコピーする関数
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // メール送信のシミュレーション
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際の実装ではここでAPIを呼び出す
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <PageContainer title="友達招待">
      <div className="space-y-6">
        <Card className="border-0 shadow-md bg-white p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-stone-800">
                友達を招待する
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                友達を招待すると、あなたも友達も
                <span className="font-medium text-amber-600">
                  1,000円分のエコポイント
                </span>
                を獲得できます
              </p>
            </div>
          </div>

          <div className="bg-teal-50 p-4 rounded-md border border-teal-100 mb-6">
            <div className="flex items-start space-x-3">
              <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-teal-800">
                  招待の環境効果
                </h3>
                <p className="text-xs text-teal-700 mt-1">
                  友達が参加するごとに、約0.5m²の森林保全に貢献できます。
                  友達10人の招待で、年間約5kgのCO2削減につながります。
                </p>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="link"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 bg-stone-100">
              <TabsTrigger value="link" className="text-xs">
                招待リンク
              </TabsTrigger>
              <TabsTrigger value="email" className="text-xs">
                メール招待
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                招待コード
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4 pt-4">
              <p className="text-sm text-stone-600">
                以下のリンクを友達と共有して招待しましょう
              </p>

              <div className="relative">
                <Input
                  value={inviteLink}
                  readOnly
                  className="pr-20 font-mono text-xs border-stone-200"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-1">{copied ? "コピー済" : "コピー"}</span>
                </Button>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 text-stone-700 space-x-2 border-stone-200"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>SMSで共有</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-stone-700 space-x-2 border-stone-200"
                >
                  <Share2 className="h-4 w-4" />
                  <span>共有</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 pt-4">
              {!emailSent ? (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm text-stone-700">
                      友達のメールアドレス
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-stone-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm text-stone-700">
                      メッセージ (任意)
                    </label>
                    <textarea
                      id="message"
                      placeholder="Eco Walletを使ってみませんか？"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2 text-sm border border-stone-200 rounded-md min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    招待メールを送信
                  </Button>
                </form>
              ) : (
                <div className="bg-green-50 p-4 rounded-md border border-green-100 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-green-800">
                    招待メールを送信しました
                  </h3>
                  <p className="text-xs text-green-700 mt-1">
                    {email} 宛に招待メールを送信しました
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 text-green-700 border-green-200"
                    onClick={() => setEmailSent(false)}
                  >
                    別の友達を招待する
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-4 pt-4">
              <p className="text-sm text-stone-600">
                友達に以下の招待コードを共有してください。友達は登録時にこのコードを入力できます。
              </p>

              <div className="flex items-center justify-center bg-stone-50 p-6 rounded-md">
                <div className="text-2xl font-bold tracking-wider font-mono text-stone-800">
                  {inviteCode}
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-stone-700 border-stone-200"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "コピー済" : "コードをコピー"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <InvitationStatusCard />
      </div>
    </PageContainer>
  );
}

// 招待状況を表示するコンポーネント
function InvitationStatusCard() {
  // 実際の実装ではAPIからデータを取得
  const invitations = [
    { email: "tanaka@example.com", status: "accepted", date: "2025/04/15" },
    { email: "suzuki@example.com", status: "pending", date: "2025/04/18" },
    { email: "yamada@example.com", status: "pending", date: "2025/04/20" },
  ];

  return (
    <Card className="border-0 shadow-md bg-white p-6">
      <h3 className="text-lg font-medium text-stone-800 mb-4">招待履歴</h3>

      {invitations.length > 0 ? (
        <div className="space-y-3">
          {invitations.map((invite, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-stone-50 rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {invite.email}
                </p>
                <p className="text-xs text-stone-500">{invite.date}</p>
              </div>
              <Badge
                className={
                  invite.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }
              >
                {invite.status === "accepted" ? "登録済み" : "未登録"}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6">
          <Users className="h-8 w-8 text-stone-400 mx-auto mb-2" />
          <p className="text-sm text-stone-600">招待履歴がありません</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-stone-600">合計獲得ポイント</div>
          <div className="text-lg font-bold text-amber-600">¥1,000</div>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          1人の友達が登録して¥1,000を獲得しました
        </p>
      </div>
    </Card>
  );
}
