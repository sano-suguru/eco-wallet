/**
 * レシートの項目の型定義
 */
export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  isEco: boolean;
}

/**
 * レシートの環境貢献効果の型定義
 */
export interface ReceiptSavings {
  paperSaved: string;
  co2Reduction: string;
}
