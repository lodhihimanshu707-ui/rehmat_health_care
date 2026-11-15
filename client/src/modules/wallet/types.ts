export interface Transaction {
  id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  paymentMethod: string;
  referenceId: string;
  status: "success" | "pending" | "failed";
  description: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions?: Transaction[];
}

