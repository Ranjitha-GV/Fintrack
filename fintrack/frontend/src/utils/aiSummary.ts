import type { AiSummaryPayload, Transaction } from "../types/finance";

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const buildAiSummaryPayload = (
  transactions: Transaction[],
): AiSummaryPayload => {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const income = transactions.filter((transaction) => transaction.type === "income");

  const totalSpent = expenses.reduce((total, item) => total + item.amount, 0);
  const totalIncome = income.reduce((total, item) => total + item.amount, 0);

  const categoryTotals = new Map<string, number>();
  for (const expense of expenses) {
    categoryTotals.set(
      expense.category,
      (categoryTotals.get(expense.category) ?? 0) + expense.amount,
    );
  }

  let topCategory = "N/A";
  let topCategoryAmount = 0;
  for (const [category, amount] of categoryTotals.entries()) {
    if (amount > topCategoryAmount) {
      topCategory = category;
      topCategoryAmount = amount;
    }
  }

  const now = new Date();
  const weekStart = new Date(now.getTime() - WEEK_IN_MS);
  const prevWeekStart = new Date(now.getTime() - 2 * WEEK_IN_MS);

  const thisWeek = expenses
    .filter((item) => {
      const date = new Date(item.date);
      return date >= weekStart && date <= now;
    })
    .reduce((total, item) => total + item.amount, 0);

  const lastWeek = expenses
    .filter((item) => {
      const date = new Date(item.date);
      return date >= prevWeekStart && date < weekStart;
    })
    .reduce((total, item) => total + item.amount, 0);

  const weeklyChange =
    lastWeek > 0 ? Number((((thisWeek - lastWeek) / lastWeek) * 100).toFixed(2)) : 0;

  const dayTotals = new Map<number, number>();
  for (const expense of expenses) {
    const day = new Date(expense.date).getDay();
    dayTotals.set(day, (dayTotals.get(day) ?? 0) + expense.amount);
  }

  let topSpendingDay = "N/A";
  let topSpendingAmount = 0;
  for (const [day, amount] of dayTotals.entries()) {
    if (amount > topSpendingAmount) {
      topSpendingAmount = amount;
      topSpendingDay = DAYS[day];
    }
  }

  return {
    totalSpent,
    totalIncome,
    topCategory,
    topCategoryAmount,
    weeklyChange,
    topSpendingDay,
  };
};
