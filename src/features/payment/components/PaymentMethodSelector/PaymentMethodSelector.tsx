import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/shared/utils/formats";
import { Wallet, CreditCard as CreditCardIcon } from "lucide-react";
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
  const getIcon = (method: PaymentMethod) => {
    switch (method) {
      case "wallet":
        return <Wallet className="h-5 w-5 text-teal-600" />;
      case "card":
        return <CreditCardIcon className="h-5 w-5 text-stone-600" />;
      default:
        return null;
    }
  };

  return (
    <RadioGroup
      value={selectedMethod}
      onValueChange={(value) => onMethodChange(value as PaymentMethod)}
      className="space-y-3"
    >
      {methods.map((method) => {
        const formattedBalance = method.balance
          ? formatCurrency(method.balance)
          : undefined;
        const isSelected = selectedMethod === method.type;

        return (
          <div
            key={method.type}
            className={`
              relative rounded-lg border p-4 transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "border-teal-500 bg-teal-50 shadow-sm"
                  : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
              }
              ${
                method.isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-stone-50"
              }
            `}
          >
            <Label
              htmlFor={method.type}
              className={`
                flex items-start space-x-3 cursor-pointer
                ${method.isDisabled ? "cursor-not-allowed" : ""}
              `}
            >
              <RadioGroupItem
                value={method.type}
                id={method.type}
                disabled={method.isDisabled}
                className="mt-0.5"
              />
              <div className="flex-1 flex items-center space-x-3">
                {getIcon(method.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span
                      className={`
                      font-medium 
                      ${isSelected ? "text-teal-800" : "text-stone-800"}
                    `}
                    >
                      {method.label}
                    </span>
                    {method.type === "wallet" && formattedBalance && (
                      <span
                        className={`
                        text-sm font-semibold
                        ${isSelected ? "text-teal-700" : "text-stone-700"}
                      `}
                      >
                        {formattedBalance}
                      </span>
                    )}
                    {method.cardLast4 && (
                      <span className="text-sm text-stone-500">
                        {method.cardBrand} ****{method.cardLast4}
                      </span>
                    )}
                  </div>
                  {method.type === "wallet" && formattedBalance && (
                    <p className="text-xs text-stone-500 mt-1">
                      現在の残高から支払います
                    </p>
                  )}
                  {method.isDisabled && (
                    <p className="text-xs text-red-600 mt-1">
                      残高が不足しています
                    </p>
                  )}
                </div>
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};
