/**
 * 招待機能関連のユーティリティ関数
 */
import { Invitation, InviteStatus } from "@/features/invite/types/invite";

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
  inviterId: string,
): Invitation => {
  return {
    email,
    code,
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    inviterId,
  };
};

/**
 * 招待を受諾済みに更新する
 */
export const updateInvitationToAccepted = (
  invitation: Invitation,
  inviteeId: string,
): Invitation => {
  return {
    ...invitation,
    status: "registered",
    usedAt: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    inviteeId,
  };
};

/**
 * 招待状態を取得する
 */
export const getInvitationStatusByCode = (
  invitations: Invitation[],
  code: string,
): InviteStatus | undefined => {
  const invitation = invitations.find((inv) => inv.code === code);
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
    (inv) => inv.status === "registered",
  ).length;
  return acceptedCount * pointsPerInvite;
};
