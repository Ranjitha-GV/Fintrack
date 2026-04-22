import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "../../types/finance";

interface TransactionState {
  transactions: Transaction[];
}

export const initialTransactionState: TransactionState = {
  transactions: [],
};

type AddTransactionPayload = Omit<Transaction, "id">;

const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialTransactionState,
  reducers: {
    addTransaction: {
      reducer: (state, action: PayloadAction<Transaction>) => {
        state.transactions.unshift(action.payload);
      },
      prepare: (payload: AddTransactionPayload) => ({
        payload: {
          ...payload,
          id: crypto.randomUUID(),
        },
      }),
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload,
      );
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions = state.transactions.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction,
      );
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  clearTransactions,
} =
  transactionSlice.actions;
export default transactionSlice.reducer;
