import { randomUUID } from "crypto";
import { CreateTransactionInput, Transaction } from "../types/transaction";

const transactions: Transaction[] = [];

export const transactionService = {
  getAll(): Transaction[] {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  },

  create(input: CreateTransactionInput): Transaction {
    const transaction: Transaction = {
      id: randomUUID(),
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: input.date,
    };

    transactions.push(transaction);
    return transaction;
  },

  remove(id: string): boolean {
    const index = transactions.findIndex((transaction) => transaction.id === id);

    if (index === -1) {
      return false;
    }

    transactions.splice(index, 1);
    return true;
  },
};
