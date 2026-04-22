"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const crypto_1 = require("crypto");
const transactions = [];
exports.transactionService = {
    getAll() {
        return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    create(input) {
        const transaction = {
            id: (0, crypto_1.randomUUID)(),
            amount: input.amount,
            type: input.type,
            category: input.category,
            date: input.date,
        };
        transactions.push(transaction);
        return transaction;
    },
    remove(id) {
        const index = transactions.findIndex((transaction) => transaction.id === id);
        if (index === -1) {
            return false;
        }
        transactions.splice(index, 1);
        return true;
    },
};
