import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    balance: number;
    ecoRank: string;
  }

  interface Session {
    user: {
      id: string;
      balance: number;
      ecoRank: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    balance: number;
    ecoRank: string;
  }
}
