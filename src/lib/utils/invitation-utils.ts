/**
 * 招待機能関連のユーティリティ関数
 */
import { Invitation, InvitationStatus } from "@/stores/invitationStore";

/**
 * 招待コードを生成する
 */
export const generateInviteCode = (): string => {
  return (
    "ECO" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  );
};

/**
 * 招待リンクを生成する
 */
export const generateInviteLink = (userId: string): string => {
  return `https://ecowallet.example.com/register?ref=${userId}`;
};

/**
 * 新しい招待オブジェクトを作成する
 */
export const createNewInvitation = (
  email: string,
  code: string,
): Invitation => {
  return {
    id: `inv_${Date.now().toString(36)}`,
    email,
    code,
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
  };
};

/**
 * 招待を受諾済みに更新する
 */
export const updateInvitationToAccepted = (
  invitation: Invitation,
): Invitation => {
  return {
    ...invitation,
    status: "accepted",
    acceptedAt: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
  };
};

/**
 * 招待状態を取得する
 */
export const getInvitationStatusById = (
  invitations: Invitation[],
  id: string,
): InvitationStatus | undefined => {
  const invitation = invitations.find((inv) => inv.id === id);
  return invitation?.status;
};

/**
 * 招待からの獲得ポイントを計算する
 */
export const calculateEarnedPoints = (
  sentInvitations: Invitation[],
  pointsPerInvite: number = 1000,
): number => {
  const acceptedCount = sentInvitations.filter(
    (inv) => inv.status === "accepted",
  ).length;
  return acceptedCount * pointsPerInvite;
};
