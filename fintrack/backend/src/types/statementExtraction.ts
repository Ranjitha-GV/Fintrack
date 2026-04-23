export interface ExtractedStatementTransaction {
  date: string;
  description: string;
  amount: number;
}

export interface StatementExtractionResponse {
  transactions: ExtractedStatementTransaction[];
}
