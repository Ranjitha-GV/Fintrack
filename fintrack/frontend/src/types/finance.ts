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

export interface AiSummaryPayload {
  totalSpent: number;
  totalIncome: number;
  topCategory: string;
  topCategoryAmount: number;
  weeklyChange: number;
  topSpendingDay: string;
}

export interface AiInsightsResponse {
  summary: string;
  insights: string[];
  suggestions: string[];
}

export interface ExtractedStatementTransaction {
  date: string;
  description: string;
  amount: number;
}

export interface StatementExtractionResponse {
  transactions: ExtractedStatementTransaction[];
}
