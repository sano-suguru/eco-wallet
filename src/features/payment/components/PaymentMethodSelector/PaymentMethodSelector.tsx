import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/shared/utils/formats";
import type { PaymentMethod, PaymentMethodDetail } from "../../types/payment";

interface PaymentMethodSelectorProps {
  methods: PaymentMethodDetail[];
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

/**
 * 支払い方法を選択するコンポーネント
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-stone-700">支払い方法</h3>
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        className="space-y-2"
      >
        {methods.map((method) => {
          const formattedBalance = method.balance
            ? formatCurrency(method.balance)
            : undefined;

          return (
            <div
              key={method.type}
              className={`flex items-center space-x-2 rounded-md border border-stone-200 p-3 ${
                method.isDisabled ? "bg-stone-50 text-stone-400" : ""
              }`}
            >
              <RadioGroupItem
                value={method.type}
                id={method.type}
                disabled={method.isDisabled}
              />
              <Label
                htmlFor={method.type}
                className={`flex-1 text-sm ${method.isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex justify-between">
                  <span>{method.label}</span>
                  {formattedBalance && (
                    <span className="font-medium">{formattedBalance}</span>
                  )}
                  {method.cardLast4 && (
                    <span className="text-stone-500">
                      {method.cardBrand} ****{method.cardLast4}
                    </span>
                  )}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
