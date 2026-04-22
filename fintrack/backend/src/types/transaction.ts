export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Insight {
  id: string;
  type: "spike" | "top-category" | "habit";
  message: string;
}
