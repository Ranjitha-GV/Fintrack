"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsights = exports.deleteTransaction = exports.addTransaction = exports.getTransactions = void 0;
const transactionService_1 = require("../services/transactionService");
const insights_1 = require("../utils/insights");
const hasValidPayload = (payload) => {
    const parsedDate = Date.parse(String(payload.date));
    return (typeof payload.amount === "number" &&
        Number.isFinite(payload.amount) &&
        payload.amount > 0 &&
        (payload.type === "income" || payload.type === "expense") &&
        typeof payload.category === "string" &&
        payload.category.trim().length > 0 &&
        Number.isFinite(parsedDate));
};
const getTransactions = (_req, res) => {
    res.json(transactionService_1.transactionService.getAll());
};
exports.getTransactions = getTransactions;
const addTransaction = (req, res) => {
    const payload = req.body;
    if (!hasValidPayload(payload)) {
        res.status(400).json({ message: "Invalid transaction payload" });
        return;
    }
    const transaction = transactionService_1.transactionService.create({
        amount: payload.amount,
        type: payload.type,
        category: payload.category.trim(),
        date: new Date(payload.date).toISOString(),
    });
    res.status(201).json(transaction);
};
exports.addTransaction = addTransaction;
const deleteTransaction = (req, res) => {
    const id = String(req.params.id ?? "");
    const isDeleted = transactionService_1.transactionService.remove(id);
    if (!isDeleted) {
        res.status(404).json({ message: "Transaction not found" });
        return;
    }
    res.status(204).send();
};
exports.deleteTransaction = deleteTransaction;
const getInsights = (_req, res) => {
    const insights = (0, insights_1.generateInsights)(transactionService_1.transactionService.getAll());
    res.json(insights);
};
exports.getInsights = getInsights;
