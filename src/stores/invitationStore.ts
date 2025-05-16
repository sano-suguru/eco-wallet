import { create } from "zustand";
import {
  generateInviteCode,
  generateInviteLink,
  createNewInvitation,
  updateInvitationToAccepted,
  getInvitationStatusById,
  calculateEarnedPoints,
} from "@/lib/utils/invitation-utils";

export type InvitationStatus = "pending" | "accepted" | "expired";

export interface Invitation {
  id: string;
  email: string;
  code: string;
  status: InvitationStatus;
  createdAt: string;
  acceptedAt?: string;
}

interface InvitationState {
  // データ
  invitations: Invitation[];
  sentInvitations: Invitation[];
  receivedInvitation?: Invitation;

  // アクション
  sendInvitation: (email: string, message?: string) => Promise<Invitation>;
  acceptInvitation: (code: string) => Promise<boolean>;
  setReceivedInvitation: (invitation: Invitation | undefined) => void;

  // ユーティリティ
  getInviteCode: () => string;
  getInviteLink: (userId: string) => string;
  getInvitationStatus: (id: string) => InvitationStatus | undefined;
  getTotalEarnedPoints: () => number;
}

// 初期招待データ（モック用）
const mockInvitations: Invitation[] = [
  {
    id: "inv_001",
    email: "tanaka@example.com",
    code: "ECO1234",
    status: "accepted",
    createdAt: "2025/04/15",
    acceptedAt: "2025/04/16",
  },
  {
    id: "inv_002",
    email: "suzuki@example.com",
    code: "ECO5678",
    status: "pending",
    createdAt: "2025/04/18",
  },
  {
    id: "inv_003",
    email: "yamada@example.com",
    code: "ECO9012",
    status: "pending",
    createdAt: "2025/04/20",
  },
];

export const useInvitationStore = create<InvitationState>((set, get) => ({
  // 初期状態
  invitations: mockInvitations,
  sentInvitations: mockInvitations,
  receivedInvitation: undefined,

  // アクション
  sendInvitation: async (email) => {
    // 実際の実装ではAPIを呼び出す
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 遅延をシミュレート

    const code = generateInviteCode();
    const newInvitation = createNewInvitation(email, code);

    set((state) => ({
      invitations: [newInvitation, ...state.invitations],
      sentInvitations: [newInvitation, ...state.sentInvitations],
    }));

    return newInvitation;
  },

  acceptInvitation: async (code) => {
    // 実際の実装ではAPIを呼び出す
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 遅延をシミュレート

    const invitation = get().invitations.find(
      (inv) => inv.code === code && inv.status === "pending",
    );

    if (!invitation) {
      return false;
    }

    const updatedInvitation = updateInvitationToAccepted(invitation);

    set((state) => ({
      invitations: state.invitations.map((inv) =>
        inv.id === invitation.id ? updatedInvitation : inv,
      ),
    }));

    return true;
  },

  setReceivedInvitation: (invitation) =>
    set({ receivedInvitation: invitation }),

  // ユーティリティ - 外部関数を使用
  getInviteCode: () => generateInviteCode(),
  getInviteLink: (userId) => generateInviteLink(userId),

  getInvitationStatus: (id) => {
    return getInvitationStatusById(get().invitations, id);
  },

  getTotalEarnedPoints: () => {
    return calculateEarnedPoints(get().sentInvitations);
  },
}));
