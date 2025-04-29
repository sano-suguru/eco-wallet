import { create } from "zustand";

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
  // 招待データ
  invitations: Invitation[];
  sentInvitations: Invitation[];
  receivedInvitation?: Invitation;

  // アクション
  generateInviteCode: () => string;
  generateInviteLink: (userId: string) => string;
  sendInvitation: (email: string, message?: string) => Promise<Invitation>;
  acceptInvitation: (code: string) => Promise<boolean>;
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

  // 招待コード生成
  generateInviteCode: () => {
    return (
      "ECO" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
    );
  },

  // 招待リンク生成
  generateInviteLink: (userId) => {
    return `https://ecowallet.example.com/register?ref=${userId}`;
  },

  // 招待送信（モック実装）
  sendInvitation: async (email) => {
    // 実際の実装ではAPIを呼び出す
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 遅延をシミュレート

    const newInvitation: Invitation = {
      id: `inv_${Date.now().toString(36)}`,
      email,
      code: get().generateInviteCode(),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    };

    set((state) => ({
      invitations: [newInvitation, ...state.invitations],
      sentInvitations: [newInvitation, ...state.sentInvitations],
    }));

    return newInvitation;
  },

  // 招待受諾（モック実装）
  acceptInvitation: async (code) => {
    // 実際の実装ではAPIを呼び出す
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 遅延をシミュレート

    const invitation = get().invitations.find(
      (inv) => inv.code === code && inv.status === "pending",
    );

    if (!invitation) {
      return false;
    }

    set((state) => ({
      invitations: state.invitations.map((inv) =>
        inv.id === invitation.id
          ? {
              ...inv,
              status: "accepted",
              acceptedAt: new Date()
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/"),
            }
          : inv,
      ),
    }));

    return true;
  },

  // 招待状態の取得
  getInvitationStatus: (id) => {
    const invitation = get().invitations.find((inv) => inv.id === id);
    return invitation?.status;
  },

  // 獲得ポイント計算（招待成功数 × 1,000円）
  getTotalEarnedPoints: () => {
    const acceptedCount = get().sentInvitations.filter(
      (inv) => inv.status === "accepted",
    ).length;
    return acceptedCount * 1000;
  },
}));
