export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarInitials: string;
  ecoRank: string;
  balance: number;
  joinDate: string;
}

export const userBalanceData: UserProfile = {
  id: "usr_12345",
  name: "山田 太郎",
  email: "eco_user@example.com",
  avatarUrl: "/api/placeholder/100/100",
  avatarInitials: "山田",
  ecoRank: "エコマイスター",
  balance: 8500,
  joinDate: "2024-12-01",
};
