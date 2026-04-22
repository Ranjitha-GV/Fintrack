export type TransactionType = "income" | "expense";
export type TransactionFilter = "all" | TransactionType;

export interface Transaction {
  id: string;
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

export interface TransactionPayload {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}
