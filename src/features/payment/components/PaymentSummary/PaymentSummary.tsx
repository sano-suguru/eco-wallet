import React from "react";
import { Separator } from "@/components/ui/separator";
import { useFormattedCurrency } from "@/shared/hooks/useFormattedCurrency";

interface PaymentSummaryProps {
  subtotal: number;
  donationAmount: number;
  total: number;
  showDonation?: boolean;
}

/**
 * 決済サマリーを表示するコンポーネント
 */
export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  donationAmount,
  total,
  showDonation = true,
}) => {
  const formattedSubtotal = useFormattedCurrency(subtotal);
  const formattedDonation = useFormattedCurrency(donationAmount);
  const formattedTotal = useFormattedCurrency(total);

  return (
    <div className="pt-2 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-stone-600">小計</span>
        <span className="text-stone-800">{formattedSubtotal}</span>
      </div>
      {showDonation && donationAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">環境保全負担金（寄付）</span>
          <span className="text-stone-800">{formattedDonation}</span>
        </div>
      )}
      <Separator className="my-2" />
      <div className="flex justify-between font-medium">
        <span className="text-stone-800">合計</span>
        <span className="text-teal-800">{formattedTotal}</span>
      </div>
    </div>
  );
};
