/**
 * @file invitationStore.ts
 * @deprecated このファイルは後方互換性のためにのみ存在します。
 * 今後は `src/stores/slices/invitation.ts` から直接インポートすることを推奨します。
 */

import { useInvitationStore as useStore } from "./slices/invitation";

// 後方互換性のためにそのまま再エクスポート
export {
  useInvitationStore,
  type Invitation,
  type InvitationStatus,
} from "./slices/invitation";

// 型定義の再エクスポート
export type { InvitationSlice as InvitationState } from "./slices/invitation";

// 旧バージョンのAPIと完全な互換性を保証
export { useStore };
