// チャージ機能の公開API

// 型定義のエクスポート
export * from "./types/charge";

// コンポーネントのエクスポート
export {
  ChargeInputContainer,
  ChargeInputForm,
  AmountInput,
  BankTransferInput,
} from "./components/ChargeInput";

export { BankTransferSection } from "./components/BankTransferSection";

export { ChargeConfirm } from "./components/ChargeConfirm";
export { ChargeComplete } from "./components/ChargeComplete";

export type {
  ChargeInputContainerProps,
  ChargeInputFormProps,
  AmountInputProps,
  BankTransferInputProps,
} from "./components/ChargeInput";

export type { BankTransferSectionProps } from "./components/BankTransferSection";

// ユーティリティ関数のエクスポート（将来追加予定）
// export { validateChargeAmount } from "./utils/validation";

// ストアのエクスポート（将来追加予定）
// export { useChargeStore } from "./store/charge.slice";
// export type { ChargeSlice } from "./store/charge.slice";
