"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  CheckCircle,
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
import { useSession } from "next-auth/react";
import { useTransactionStore } from "@/stores/slices/transaction";
import { useBalanceStore } from "@/stores/slices/balance";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// 受取人のモックデータ
const recentRecipients = [
  { id: "rec1", name: "田中", avatar: "/api/placeholder/32/32", color: "blue" },
  {
    id: "rec2",
    name: "佐藤",
    avatar: "/api/placeholder/32/32",
    color: "green",
  },
  {
    id: "rec3",
    name: "鈴木",
    avatar: "/api/placeholder/32/32",
    color: "purple",
  },
  {
    id: "rec4",
    name: "高橋",
    avatar: "/api/placeholder/32/32",
    color: "amber",
  },
];

export default function TransferSplitPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const subtractFromRegularBalance = useBalanceStore(
    (state) => state.subtractFromRegularBalance,
  );

  // 送金関連のstate
  const [activeTab, setActiveTab] = useState<"transfer" | "split">("transfer");
  const [recipient, setRecipient] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<
    (typeof recentRecipients)[0] | null
  >(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isDonateChecked, setIsDonateChecked] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 割り勘関連のstate
  const [splitTitle, setSplitTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [participants, setParticipants] = useState([
    {
      id: "self",
      name: "あなた（山田太郎）",
      isPayor: true,
      amount: "",
      email: "",
    },
    {
      id: "p1",
      name: "田中 花子",
      isEcoUser: true,
      amount: "",
      email: "tanaka@example.com",
    },
    { id: "p2", name: "佐藤 健太", isEcoUser: false, amount: "", email: "" },
  ]);
  const [isReceiptDisabled, setIsReceiptDisabled] = useState(true);
  const [splitMethod, setSplitMethod] = useState("wallet");
  const [isSplitProcessing, setIsSplitProcessing] = useState(false);
  const [splitError, setSplitError] = useState<string | null>(null);
  const [isSplitSuccess, setIsSplitSuccess] = useState(false);

  // バリデーション関数
  const validateTransfer = () => {
    if (!selectedRecipient && !recipient) {
      setError("送金先を選択または入力してください");
      return false;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("有効な金額を入力してください");
      return false;
    }

    if (Number(amount) > (session?.user?.balance || 0)) {
      setError("残高が不足しています");
      return false;
    }

    return true;
  };

  const validateSplit = () => {
    if (!splitTitle) {
      setSplitError("タイトルを入力してください");
      return false;
    }

    if (
      !totalAmount ||
      isNaN(Number(totalAmount)) ||
      Number(totalAmount) <= 0
    ) {
      setSplitError("有効な合計金額を入力してください");
      return false;
    }

    // 参加者の金額合計が合計金額と一致するか確認
    const participantsTotal = participants.reduce((sum, p) => {
      const pAmount = Number(p.amount) || 0;
      return sum + pAmount;
    }, 0);

    if (participantsTotal !== Number(totalAmount)) {
      setSplitError(
        `参加者の金額合計（${participantsTotal}円）が合計金額（${totalAmount}円）と一致しません`,
      );
      return false;
    }

    // メールアドレスが必要な参加者に入力されているか確認
    const missingEmail = participants.find(
      (p) => !p.isEcoUser && p.id !== "self" && !p.email,
    );
    if (missingEmail) {
      setSplitError(`${missingEmail.name}のメールアドレスを入力してください`);
      return false;
    }

    return true;
  };

  // 送金処理のハンドラー
  const handleTransfer = async () => {
    setError(null);

    if (!validateTransfer()) {
      return;
    }

    setIsProcessing(true);

    try {
      // 送金処理のモック - 実際のAPIコールの代わりにタイマーを使用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const recipientName = selectedRecipient
        ? selectedRecipient.name
        : recipient;
      const transferAmount = Number(amount);
      const donationAmount = isDonateChecked
        ? Math.ceil(transferAmount * 0.01)
        : 0;
      const totalDeduction = transferAmount + donationAmount;

      // トランザクションの追加
      const transactionId = addTransaction({
        type: "payment",
        description: `${recipientName}へ送金`,
        date: new Date()
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "/"),
        amount: -totalDeduction,
        ecoContribution: isDonateChecked
          ? {
              enabled: true,
              amount: donationAmount,
            }
          : undefined,
      });

      // 残高の更新
      subtractFromRegularBalance(totalDeduction);

      // 成功状態にする
      setIsSuccess(true);

      // 3秒後にリダイレクト
      setTimeout(() => {
        router.push(`/history/${transactionId}`);
      }, 3000);
    } catch (error) {
      console.error("送金処理中にエラーが発生しました", error);
      setError("送金処理に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  // 受取人を選択するハンドラー
  const handleRecipientSelect = (recipient: (typeof recentRecipients)[0]) => {
    setSelectedRecipient(recipient);
    setRecipient(recipient.name);
  };

  // 割り勘機能：参加者の金額を更新
  const updateParticipantAmount = (id: string, value: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, amount: value } : p)),
    );
  };

  // 割り勘機能：参加者のメールアドレスを更新
  const updateParticipantEmail = (id: string, value: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, email: value } : p)),
    );
  };

  // 割り勘機能：均等に金額を分ける
  const distributeEvenly = () => {
    if (
      !totalAmount ||
      isNaN(Number(totalAmount)) ||
      Number(totalAmount) <= 0
    ) {
      setSplitError("有効な合計金額を入力してください");
      return;
    }

    const evenAmount = Math.floor(Number(totalAmount) / participants.length);
    const remainder = Number(totalAmount) - evenAmount * participants.length;

    setParticipants((prev) =>
      prev.map((p, index) => ({
        ...p,
        amount:
          index === 0 ? String(evenAmount + remainder) : String(evenAmount),
      })),
    );
  };

  // 割り勘処理のハンドラー
  const handleSplitRequest = async () => {
    setSplitError(null);

    if (!validateSplit()) {
      return;
    }

    setIsSplitProcessing(true);

    try {
      // 割り勘処理のモック - 実際のAPIコールの代わりにタイマーを使用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // トランザクションの追加（立替分）
      const transactionId = addTransaction({
        type: "payment",
        description: `${splitTitle}（立替）`,
        date: new Date()
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "/"),
        amount: -Number(totalAmount),
        ecoContribution: {
          enabled: true,
          amount: Math.ceil(Number(totalAmount) * 0.01),
        },
        badges: ["割り勘"],
      });

      // 他の参加者からの入金予定（別途モデル化が必要）
      const receivableAmount = participants
        .filter((p) => p.id !== "self")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      if (receivableAmount > 0) {
        addTransaction({
          type: "receive",
          description: `${splitTitle}（割り勘請求）`,
          date: new Date()
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "/"),
          amount: receivableAmount,
          badges: ["割り勘", "未受取"],
        });
      }

      // 残高の更新（立替分）
      subtractFromRegularBalance(Number(totalAmount));

      // 成功状態にする
      setIsSplitSuccess(true);

      // 3秒後にリダイレクト
      setTimeout(() => {
        router.push(`/history/${transactionId}`);
      }, 3000);
    } catch (error) {
      console.error("割り勘処理中にエラーが発生しました", error);
      setSplitError(
        "割り勘処理に失敗しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsSplitProcessing(false);
    }
  };

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
              <Badge className="bg-blue-100 text-blue-800">
                残高 ¥{(session?.user?.balance || 8500).toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue="transfer"
              className="w-full"
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "transfer" | "split")
              }
            >
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
                {isSuccess ? (
                  <div className="bg-teal-50 p-4 rounded-md border border-teal-100 flex items-center mb-4">
                    <div className="mr-3 bg-teal-100 rounded-full p-2">
                      <CheckCircle className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-teal-800">
                        送金完了
                      </h3>
                      <p className="text-xs text-teal-700">
                        {selectedRecipient?.name || recipient}へ
                        {Number(amount).toLocaleString()}
                        円の送金が完了しました。 取引詳細ページに移動します...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
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
                          value={recipient}
                          onChange={(e) => {
                            setRecipient(e.target.value);
                            if (selectedRecipient) setSelectedRecipient(null);
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-md p-3">
                      <p className="text-xs text-stone-500 mb-2">
                        最近の送金先
                      </p>
                      <div className="flex space-x-2 overflow-x-auto pb-1">
                        {recentRecipients.map((recip) => (
                          <div
                            key={recip.id}
                            className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer"
                            onClick={() => handleRecipientSelect(recip)}
                          >
                            <Avatar
                              className={`h-12 w-12 border ${selectedRecipient?.id === recip.id ? "border-teal-500" : "border-stone-200"}`}
                            >
                              <AvatarImage
                                src={recip.avatar}
                                alt={recip.name}
                              />
                              <AvatarFallback
                                className={`bg-${recip.color}-100 text-${recip.color}-800`}
                              >
                                {recip.name}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{recip.name}</span>
                          </div>
                        ))}
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
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
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
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                          <Switch
                            id="eco-donation"
                            checked={isDonateChecked}
                            onCheckedChange={setIsDonateChecked}
                          />
                        </div>
                        <p className="text-xs text-teal-700 mt-1">
                          この送金の1%（
                          {amount
                            ? Math.ceil(Number(amount) * 0.01).toLocaleString()
                            : 0}
                          円）を環境保全プロジェクトに寄付します
                        </p>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">送金額</span>
                        <span className="font-medium text-stone-800">
                          ¥{Number(amount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">手数料</span>
                        <span className="font-medium text-stone-800">¥0</span>
                      </div>
                      {isDonateChecked && (
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-600">
                            環境保全寄付（1%）
                          </span>
                          <span className="font-medium text-teal-700">
                            ¥
                            {amount
                              ? Math.ceil(
                                  Number(amount) * 0.01,
                                ).toLocaleString()
                              : 0}
                          </span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span className="text-stone-800">合計</span>
                        <span className="text-teal-800">
                          ¥
                          {amount
                            ? (
                                Number(amount) +
                                (isDonateChecked
                                  ? Math.ceil(Number(amount) * 0.01)
                                  : 0)
                              ).toLocaleString()
                            : 0}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-4"
                      onClick={handleTransfer}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" light className="mr-2" />
                          送金処理中...
                        </div>
                      ) : (
                        "送金する"
                      )}
                    </Button>
                  </>
                )}
              </TabsContent>

              {/* 割り勘タブ */}
              <TabsContent value="split" className="px-6 py-4 space-y-4">
                {isSplitSuccess ? (
                  <div className="bg-teal-50 p-4 rounded-md border border-teal-100 flex items-center mb-4">
                    <div className="mr-3 bg-teal-100 rounded-full p-2">
                      <CheckCircle className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-teal-800">
                        割り勘請求完了
                      </h3>
                      <p className="text-xs text-teal-700">
                        「{splitTitle}」の割り勘請求が完了しました。
                        参加者に通知が送信されました。取引詳細ページに移動します...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
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
                        value={splitTitle}
                        onChange={(e) => setSplitTitle(e.target.value)}
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
                          value={totalAmount}
                          onChange={(e) => setTotalAmount(e.target.value)}
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
                        {participants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback
                                  className={
                                    participant.id === "self"
                                      ? "bg-teal-100 text-teal-800"
                                      : participant.id === "p1"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                  }
                                >
                                  {participant.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm text-stone-800">
                                  {participant.name}
                                </p>
                                {participant.id === "self" ? (
                                  <p className="text-xs text-stone-500">
                                    支払い者
                                  </p>
                                ) : participant.isEcoUser ? (
                                  <p className="text-xs text-teal-600">
                                    Eco Wallet利用者
                                  </p>
                                ) : (
                                  <div className="flex items-center">
                                    <Input
                                      placeholder="メールアドレスを入力"
                                      className="w-full h-6 text-xs border-stone-200 py-0"
                                      value={participant.email}
                                      onChange={(e) =>
                                        updateParticipantEmail(
                                          participant.id,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={participant.amount}
                                onChange={(e) =>
                                  updateParticipantAmount(
                                    participant.id,
                                    e.target.value,
                                  )
                                }
                                className="w-20 h-8 text-sm border-stone-200"
                              />
                              <span className="text-sm text-stone-500">円</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-stone-200"
                        onClick={distributeEvenly}
                      >
                        <Calculator className="h-3 w-3 mr-1" />
                        均等に分ける
                      </Button>
                      <div className="text-sm">
                        <span className="text-stone-600">合計：</span>
                        <span className="font-medium text-stone-800">
                          ¥{Number(totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-teal-50 border border-teal-100 rounded-md p-3">
                      <div className="flex items-center">
                        <Checkbox
                          id="eco-receipt"
                          checked={isReceiptDisabled}
                          onCheckedChange={(checked) =>
                            setIsReceiptDisabled(checked as boolean)
                          }
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
                      <Select
                        value={splitMethod}
                        onValueChange={setSplitMethod}
                      >
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

                    {splitError && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <p className="text-sm text-red-700">{splitError}</p>
                      </div>
                    )}

                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">あなたの立替額</span>
                        <span className="font-medium text-stone-800">
                          ¥{Number(totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">回収予定額</span>
                        <span className="font-medium text-stone-800">
                          ¥
                          {participants
                            .filter((p) => p.id !== "self")
                            .reduce((sum, p) => sum + Number(p.amount || 0), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">環境貢献額</span>
                        <span className="font-medium text-teal-700">
                          ¥
                          {Math.ceil(
                            Number(totalAmount || 0) * 0.01,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="text-stone-700 border-stone-200"
                      >
                        下書き保存
                      </Button>
                      <Button
                        className="bg-teal-700 hover:bg-teal-800 text-white"
                        onClick={handleSplitRequest}
                        disabled={isSplitProcessing}
                      >
                        {isSplitProcessing ? (
                          <div className="flex items-center justify-center">
                            <LoadingSpinner size="sm" light className="mr-2" />
                            処理中...
                          </div>
                        ) : (
                          "請求を送信"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="bg-stone-100 rounded-md p-4">
          <h3 className="text-sm font-medium text-stone-800 mb-2">
            過去の割り勘
          </h3>
          <div className="space-y-3">
            <Link href="/history/split-camp-123">
              <div className="bg-white rounded-md p-3 border border-stone-200 flex justify-between items-center hover:bg-stone-50 transition-colors cursor-pointer">
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
            </Link>

            <Link href="/history/split-fuji-456">
              <div className="bg-white rounded-md p-3 border border-stone-200 flex justify-between items-center hover:bg-stone-50 transition-colors cursor-pointer">
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
            </Link>
          </div>

          <Link href="/history">
            <Button
              variant="ghost"
              className="w-full text-stone-600 mt-2 text-sm"
            >
              すべての履歴を見る
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <p className="text-xs text-center text-stone-500">
          お客様の送金ごとに、金額の1%を環境保護団体に寄付できます
        </p>
      </div>
    </div>
  );
}
