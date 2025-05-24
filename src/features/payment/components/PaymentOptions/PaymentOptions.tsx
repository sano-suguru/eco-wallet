import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/shared/utils/formats";
import type { PaymentOptions as PaymentOptionsType } from "../../types/payment";

interface PaymentOptionsProps {
  options: PaymentOptionsType;
  onOptionsChange: (options: Partial<PaymentOptionsType>) => void;
}

/**
 * 決済オプション（寄付・レシート設定）を管理するコンポーネント
 */
export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  options,
  onOptionsChange,
}) => {
  const handleDonationChange = (checked: boolean) => {
    onOptionsChange({ includeDonation: checked });
  };

  const handleReceiptChange = (checked: boolean) => {
    onOptionsChange({ disablePaperReceipt: checked });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="donate"
          checked={options.includeDonation}
          onCheckedChange={handleDonationChange}
        />
        <div className="grid gap-1">
          <Label
            htmlFor="donate"
            className="text-sm font-medium text-stone-800 cursor-pointer"
          >
            環境保全活動に{formatCurrency(options.donationAmount)}を寄付する
          </Label>
          {options.donationDescription && (
            <p className="text-xs text-stone-600">
              {options.donationDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="receipt"
          checked={options.disablePaperReceipt}
          onCheckedChange={handleReceiptChange}
        />
        <div className="grid gap-1">
          <Label
            htmlFor="receipt"
            className="text-sm font-medium text-stone-800 cursor-pointer"
          >
            紙のレシートを発行しない
          </Label>
          <p className="text-xs text-stone-600">
            電子レシートをメールでお送りします
          </p>
        </div>
      </div>
    </div>
  );
};
