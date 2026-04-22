import axios from "axios";
import type { Insight, Transaction, TransactionPayload } from "../types/finance";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
};
