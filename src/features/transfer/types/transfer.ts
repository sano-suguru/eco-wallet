// 送金・割り勘関連の型定義

export interface Recipient {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  email?: string;
  isEcoUser?: boolean;
}

export interface TransferFormData {
  recipient: string;
  selectedRecipient: Recipient | null;
  amount: string;
  message?: string;
  isDonateChecked: boolean;
}

export interface SplitParticipant {
  id: string;
  name: string;
  isPayor?: boolean;
  isEcoUser?: boolean;
  amount: string;
  email: string;
}

export interface SplitFormData {
  splitTitle: string;
  totalAmount: string;
  participants: SplitParticipant[];
  isReceiptDisabled: boolean;
  splitMethod: "wallet" | "bank" | "qr";
}

export interface TransferResult {
  transactionId: string;
  recipientName: string;
  transferAmount: number;
  donationAmount: number;
  totalDeduction: number;
}

export interface SplitResult {
  transactionId: string;
  splitTitle: string;
  totalAmount: number;
  receivableAmount: number;
}

export interface TransferError {
  message: string;
  code?: string;
}

export interface SplitHistory {
  id: string;
  title: string;
  date: string;
  participantCount: number;
  amount: number;
  status: "completed" | "pending" | "cancelled";
}
