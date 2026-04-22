import { Insight, Transaction } from "../types/transaction";

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

const formatInr = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const generateInsights = (transactions: Transaction[]): Insight[] => {
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
        message: `You spent ${formatInr(thisWeekSpend)} this week, which is ${Math.abs(changePercent).toFixed(0)}% ${trend} than last week`,
      });
    }
  }

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthCategoryTotals = new Map<string, number>();

  for (const transaction of expenses) {
    const date = new Date(transaction.date);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      monthCategoryTotals.set(
        transaction.category,
        (monthCategoryTotals.get(transaction.category) ?? 0) + transaction.amount,
      );
    }
  }

  const topCategoryEntry = [...monthCategoryTotals.entries()].reduce<
    [string, number] | null
  >((best, entry) => {
    if (!best || entry[1] > best[1]) {
      return entry;
    }
    return best;
  }, null);

  if (topCategoryEntry) {
    insights.push({
      id: "top-category",
      type: "top-category",
      message: `Your highest spending category is ${topCategoryEntry[0]} (${formatInr(topCategoryEntry[1])})`,
    });
  }

  const dayTotals = new Map<number, number>();
  for (const transaction of expenses) {
    const day = new Date(transaction.date).getDay();
    dayTotals.set(day, (dayTotals.get(day) ?? 0) + transaction.amount);
  }

  const mostExpensiveDayEntry = [...dayTotals.entries()].reduce<[number, number] | null>(
    (best, entry) => {
      if (!best || entry[1] > best[1]) {
        return entry;
      }
      return best;
    },
    null,
  );

  if (mostExpensiveDayEntry) {
    insights.push({
      id: "spending-habit",
      type: "habit",
      message: `You tend to spend the most on ${DAYS[mostExpensiveDayEntry[0]]}`,
    });
  }

  return insights.slice(0, 3);
};
