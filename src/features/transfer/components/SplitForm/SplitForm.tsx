"use client";

import React from "react";
import { Plus, Users, Divide, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorMessage } from "@/components/ui/error-message";
import { useSplitForm } from "../../hooks/useSplitForm";
import { SuccessMessage } from "../SuccessMessage";
import { formatCurrency } from "@/shared/utils/formats";
import { cn } from "@/lib/utils";

// 参加者アイテムコンポーネント
const ParticipantItem: React.FC<{
  participant: {
    id: string;
    name: string;
    isPayor?: boolean;
    isEcoUser?: boolean;
    amount: string;
    email: string;
  };
  onAmountChange: (id: string, amount: string) => void;
  onEmailChange: (id: string, email: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}> = ({ participant, onAmountChange, onEmailChange, onRemove, canRemove }) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-700">{participant.name}</span>
          {participant.isPayor && (
            <Badge variant="secondary" className="text-xs">
              立替者
            </Badge>
          )}
          {participant.isEcoUser && (
            <Badge className="bg-teal-100 text-teal-700 text-xs">
              <Leaf className="h-3 w-3 mr-1" />
              Eco
            </Badge>
          )}
        </div>
        {!participant.isEcoUser && !participant.isPayor && (
          <Input
            type="email"
            placeholder="メールアドレス"
            value={participant.email}
            onChange={(e) => onEmailChange(participant.id, e.target.value)}
            className="mt-2 text-sm"
          />
        )}
      </div>
      <div className="w-32">
        <Input
          type="number"
          placeholder="金額"
          value={participant.amount}
          onChange={(e) => onAmountChange(participant.id, e.target.value)}
          className="text-right"
        />
      </div>
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(participant.id)}
          className="text-stone-500 hover:text-stone-700"
        >
          ×
        </Button>
      )}
    </div>
  );
};

export const SplitForm: React.FC = () => {
  const {
    formData,
    updateField,
    updateParticipantAmount,
    updateParticipantEmail,
    distributeEvenly,
    addParticipant,
    removeParticipant,
    handleSplitRequest,
    isProcessing,
    error,
    isSuccess,
    totalAmount,
    donationAmount,
  } = useSplitForm();

  // 新しい参加者を追加するためのローカル状態
  const [newParticipantName, setNewParticipantName] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);

  const handleAddParticipant = () => {
    if (newParticipantName.trim()) {
      addParticipant(newParticipantName.trim());
      setNewParticipantName("");
      setShowAddForm(false);
    }
  };

  // 合計金額が参加者の金額の合計と一致しているかチェック
  const participantTotal = formData.participants.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );
  const isAmountMatched = totalAmount > 0 && participantTotal === totalAmount;

  if (isSuccess) {
    return (
      <SuccessMessage
        title="割り勘リクエストを送信しました"
        message={`${formData.participants.length}人に割り勘リクエストを送信しました`}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* タイトル入力 */}
      <div>
        <Label htmlFor="splitTitle">割り勘タイトル</Label>
        <Input
          id="splitTitle"
          placeholder="例：キャンプ用品費用"
          value={formData.splitTitle}
          onChange={(e) => updateField("splitTitle", e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 合計金額入力 */}
      <div>
        <Label htmlFor="totalAmount">合計金額</Label>
        <Input
          id="totalAmount"
          type="number"
          placeholder="¥0"
          value={formData.totalAmount}
          onChange={(e) => updateField("totalAmount", e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 参加者リスト */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-stone-600" />
            <h3 className="font-medium">参加者</h3>
            <Badge variant="secondary">{formData.participants.length}人</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={distributeEvenly}
            disabled={!totalAmount || totalAmount <= 0}
            className="gap-2"
          >
            <Divide className="h-4 w-4" />
            均等に分ける
          </Button>
        </div>

        <div className="space-y-2">
          {formData.participants.map((participant) => (
            <div key={participant.id}>
              <ParticipantItem
                participant={participant}
                onAmountChange={updateParticipantAmount}
                onEmailChange={updateParticipantEmail}
                onRemove={removeParticipant}
                canRemove={
                  !participant.isPayor && formData.participants.length > 2
                }
              />
              <Separator className="last:hidden" />
            </div>
          ))}
        </div>

        {/* 参加者追加フォーム */}
        {showAddForm ? (
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="参加者の名前"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddParticipant()}
            />
            <Button onClick={handleAddParticipant} size="sm">
              追加
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setNewParticipantName("");
              }}
            >
              キャンセル
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="mt-4 w-full"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            参加者を追加
          </Button>
        )}
      </Card>

      {/* 金額の確認 */}
      {totalAmount > 0 && (
        <Alert
          className={cn(
            "border-l-4",
            isAmountMatched ? "border-teal-600" : "border-amber-600",
          )}
        >
          <AlertDescription>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>合計金額:</span>
                <span className="font-medium">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>参加者合計:</span>
                <span
                  className={cn(
                    "font-medium",
                    isAmountMatched ? "text-teal-600" : "text-amber-600",
                  )}
                >
                  {formatCurrency(participantTotal)}
                </span>
              </div>
              {!isAmountMatched && (
                <div className="text-sm text-amber-600 mt-2">
                  ※ 合計金額と参加者の金額が一致していません
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 送金方法の選択 */}
      <div>
        <Label>送金方法</Label>
        <RadioGroup
          value={formData.splitMethod}
          onValueChange={(value) =>
            updateField("splitMethod", value as "wallet" | "bank" | "qr")
          }
          className="mt-3 space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="wallet" id="wallet" />
            <Label htmlFor="wallet" className="cursor-pointer">
              Eco Wallet残高から送金
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="cursor-pointer">
              銀行振込で送金
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="qr" id="qr" />
            <Label htmlFor="qr" className="cursor-pointer">
              QRコードで送金
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 環境保全への寄付 */}
      <Card className="p-4 bg-teal-50 border-teal-200">
        <div className="flex items-start gap-3">
          <Leaf className="h-5 w-5 text-teal-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-teal-900">環境保全への寄付</h4>
            <p className="text-sm text-teal-700 mt-1">
              立替金額の0.1%（{formatCurrency(donationAmount)}
              ）が環境保全団体に寄付されます
            </p>
          </div>
        </div>
      </Card>

      {/* エラーメッセージ */}
      {error && <ErrorMessage message={error} />}

      {/* 送信ボタン */}
      <Button
        onClick={handleSplitRequest}
        disabled={isProcessing || !isAmountMatched}
        className="w-full bg-teal-600 hover:bg-teal-700"
      >
        {isProcessing ? "処理中..." : "割り勘リクエストを送信"}
      </Button>
    </div>
  );
};
