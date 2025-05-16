/**
 * Zustandのストア関連コンポーネントをエクスポート
 */

// スライス
export * from "./slices";

// 個別のストアエクスポート（後方互換性のため）
export { useBalanceStore } from "./slices/balance";
export { useCampaignStore } from "./slices/campaign";
export { useEcoImpactStore } from "./slices/ecoImpact";
export {
  useInvitationStore,
  type Invitation,
  type InvitationStatus,
} from "./slices/invitation";
export { useTransactionStore } from "./slices/transaction";

// 型定義
export * from "./types";
