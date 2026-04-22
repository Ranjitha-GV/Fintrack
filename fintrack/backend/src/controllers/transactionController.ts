import { Request, Response } from "express";
import { transactionService } from "../services/transactionService";
import { generateInsights } from "../utils/insights";
import { CreateTransactionInput } from "../types/transaction";

const hasValidPayload = (payload: Partial<CreateTransactionInput>): payload is CreateTransactionInput => {
  const parsedDate = Date.parse(String(payload.date));
  return (
    typeof payload.amount === "number" &&
    Number.isFinite(payload.amount) &&
    payload.amount > 0 &&
    (payload.type === "income" || payload.type === "expense") &&
    typeof payload.category === "string" &&
    payload.category.trim().length > 0 &&
    Number.isFinite(parsedDate)
  );
};

export const getTransactions = (_req: Request, res: Response): void => {
  res.json(transactionService.getAll());
};

export const addTransaction = (req: Request, res: Response): void => {
  const payload = req.body as Partial<CreateTransactionInput>;

  if (!hasValidPayload(payload)) {
    res.status(400).json({ message: "Invalid transaction payload" });
    return;
  }

  const transaction = transactionService.create({
    amount: payload.amount,
    type: payload.type,
    category: payload.category.trim(),
    date: new Date(payload.date).toISOString(),
  });

  res.status(201).json(transaction);
};

export const deleteTransaction = (req: Request, res: Response): void => {
  const id = String(req.params.id ?? "");
  const isDeleted = transactionService.remove(id);

  if (!isDeleted) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  res.status(204).send();
};

export const getInsights = (_req: Request, res: Response): void => {
  const insights = generateInsights(transactionService.getAll());
  res.json(insights);
};
