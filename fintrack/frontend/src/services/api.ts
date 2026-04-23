import axios from "axios";
import type {
  AiInsightsResponse,
  AiSummaryPayload,
  StatementExtractionResponse,
  Insight,
  Transaction,
  TransactionPayload,
} from "../types/finance";

const resolvedBaseUrl = (
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: resolvedBaseUrl,
});

export const financeApi = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>("/transactions");
    return response.data;
  },

  async addTransaction(payload: TransactionPayload): Promise<Transaction> {
    const response = await api.post<Transaction>("/transactions", payload);
    return response.data;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getInsights(): Promise<Insight[]> {
    const response = await api.get<Insight[]>("/insights");
    return response.data;
  },

  async getAiInsights(summary: AiSummaryPayload): Promise<AiInsightsResponse> {
    const response = await api.post<AiInsightsResponse>("/ai-insights", {
      summary,
    });
    return response.data;
  },

  async extractStatement(file: File): Promise<StatementExtractionResponse> {
    const formData = new FormData();
    formData.append("statement", file);
    const response = await api.post<StatementExtractionResponse>(
      "/transactions/extract-statement",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
};
