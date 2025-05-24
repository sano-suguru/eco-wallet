import React from "react";
import { useFormattedCurrency } from "@/shared/hooks/useFormattedCurrency";
import type { Product } from "../../types/payment";

interface ProductInfoProps {
  product: Product;
}

/**
 * 商品情報を表示するコンポーネント
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const formattedPrice = useFormattedCurrency(product.price);

  return (
    <div className="bg-stone-50 rounded-md p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-stone-200 rounded flex items-center justify-center">
            {product.icon ? (
              <div dangerouslySetInnerHTML={{ __html: product.icon }} />
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-stone-500">
                <path
                  fill="currentColor"
                  d="M21,9H3V3H21V9M13,11H3V21H13V11M21,11H15V15H21V11M21,17H15V21H21V17Z"
                />
              </svg>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-stone-800">
              {product.name}
            </h4>
            <p className="text-xs text-stone-600">{product.description}</p>
          </div>
        </div>
        <span className="text-sm font-medium text-stone-800">
          {formattedPrice}
        </span>
      </div>
    </div>
  );
};
