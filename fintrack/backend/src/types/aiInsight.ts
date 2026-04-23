export interface AiSummaryInput {
  totalSpent: number;
  totalIncome: number;
  topCategory: string;
  topCategoryAmount: number;
  weeklyChange: number;
  topSpendingDay: string;
}

export interface AiInsightsRequestBody {
  summary: AiSummaryInput;
}

export interface AiInsightsResponse {
  summary: string;
  insights: string[];
  suggestions: string[];
}
