import React from "react";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "@/shared/utils/formats";

interface SuccessMessageProps {
  title?: string;
  message?: string;
  recipientName?: string;
  transferAmount?: number;
  donationAmount?: number;
  totalDeduction?: number;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  recipientName,
  transferAmount,
  donationAmount,
  totalDeduction,
}) => {
  // 送金完了メッセージの場合
  if (recipientName && transferAmount !== undefined) {
    return (
      <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-teal-100 rounded-full p-2">
            <CheckCircle className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-teal-800">
              送金が完了しました
            </h3>
            <p className="text-sm text-teal-700">
              {recipientName}への送金が正常に処理されました
            </p>
          </div>
        </div>

        <div className="space-y-2 bg-white p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">送金額</span>
            <span className="font-medium">
              {formatCurrency(transferAmount)}
            </span>
          </div>
          {donationAmount !== undefined && donationAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">環境保全寄付</span>
              <span className="text-teal-600">
                {formatCurrency(donationAmount)}
              </span>
            </div>
          )}
          {totalDeduction !== undefined && (
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-stone-600">合計</span>
              <span className="font-medium">
                {formatCurrency(totalDeduction)}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-teal-600 mt-4 text-center">
          まもなく詳細画面へ移動します...
        </p>
      </div>
    );
  }

  // 汎用メッセージの場合
  return (
    <div className="bg-teal-50 p-4 rounded-md border border-teal-100 flex items-center mb-4">
      <div className="mr-3 bg-teal-100 rounded-full p-2">
        <CheckCircle className="h-6 w-6 text-teal-600" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-teal-800">{title}</h3>
        <p className="text-xs text-teal-700">{message}</p>
      </div>
    </div>
  );
};
