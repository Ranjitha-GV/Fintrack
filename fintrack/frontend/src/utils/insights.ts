import type { Transaction, Insight } from "../types/finance";
import type { CurrencyCode } from "../store/slices/settingsSlice";
import { formatCurrency } from "./format";

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

export const generateInsights = (
  transactions: Transaction[],
  currency: CurrencyCode,
): Insight[] => {
  const insights: Insight[] = [];
  const expenses = transactions.filter((transaction) => transaction.type === "expense");

  const now = new Date();
  const currentWeekStart = new Date(now.getTime() - WEEK_IN_MS);
  const previousWeekStart = new Date(now.getTime() - 2 * WEEK_IN_MS);

  const thisWeekSpend = expenses
    .filter((transaction) => {
      const date = new Date(transaction.date);
      return date >= currentWeekStart && date <= now;
    })
    .reduce((total, transaction) => total + transaction.amount, 0);

  const lastWeekSpend = expenses
    .filter((transaction) => {
      const date = new Date(transaction.date);
      return date >= previousWeekStart && date < currentWeekStart;
    })
    .reduce((total, transaction) => total + transaction.amount, 0);

  if (lastWeekSpend > 0) {
    const changePercent = ((thisWeekSpend - lastWeekSpend) / lastWeekSpend) * 100;
    if (Math.abs(changePercent) > 20) {
      const trend = changePercent > 0 ? "higher" : "lower";
      insights.push({
        id: "weekly-spike",
        type: "spike",
        message: `You spent ${formatCurrency(thisWeekSpend, currency)} this week, which is ${Math.abs(
          changePercent,
        ).toFixed(0)}% ${trend} than last week`,
      });
    }
  }

  const monthCategoryTotals = new Map<string, number>();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (const expense of expenses) {
    const date = new Date(expense.date);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      monthCategoryTotals.set(
        expense.category,
        (monthCategoryTotals.get(expense.category) ?? 0) + expense.amount,
      );
    }
  }

  const topCategory = [...monthCategoryTotals.entries()].reduce<[string, number] | null>(
    (best, entry) => {
      if (!best || entry[1] > best[1]) {
        return entry;
      }
      return best;
    },
    null,
  );

  if (topCategory) {
    insights.push({
      id: "top-category",
      type: "top-category",
      message: `Your highest spending category is ${topCategory[0]} (${formatCurrency(
        topCategory[1],
        currency,
      )})`,
    });
  }

  const dayTotals = new Map<number, number>();
  for (const expense of expenses) {
    const day = new Date(expense.date).getDay();
    dayTotals.set(day, (dayTotals.get(day) ?? 0) + expense.amount);
  }

  const habitDay = [...dayTotals.entries()].reduce<[number, number] | null>(
    (best, entry) => {
      if (!best || entry[1] > best[1]) {
        return entry;
      }
      return best;
    },
    null,
  );

  if (habitDay) {
    insights.push({
      id: "spending-habit",
      type: "habit",
      message: `You tend to spend the most on ${DAYS[habitDay[0]]}`,
    });
  }

  return insights.slice(0, 3);
};
