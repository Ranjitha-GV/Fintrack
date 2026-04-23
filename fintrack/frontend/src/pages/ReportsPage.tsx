import { useMemo, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { formatCurrency } from "../utils/format";

const CHART_COLORS = [
  "#8b5cf6",
  "#22c55e",
  "#06b6d4",
  "#f97316",
  "#eab308",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
];

const RADIUS = 82;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ExpenseSlice {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface PieTooltipState {
  x: number;
  y: number;
  slice: ExpenseSlice;
}

export const ReportsPage = () => {
  const transactions = useAppSelector((state) => state.transaction.transactions);
  const currency = useAppSelector((state) => state.settings.currency);
  const [tooltip, setTooltip] = useState<PieTooltipState | null>(null);

  const expenseSlices = useMemo<ExpenseSlice[]>(() => {
    const totalsByCategory = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((map, transaction) => {
        const current = map.get(transaction.category) ?? 0;
        map.set(transaction.category, current + transaction.amount);
        return map;
      }, new Map<string, number>());

    const totalExpense = [...totalsByCategory.values()].reduce(
      (total, amount) => total + amount,
      0,
    );

    if (totalExpense <= 0) {
      return [];
    }

    return [...totalsByCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: (amount / totalExpense) * 100,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [transactions]);

  const totalExpenseAmount = useMemo(
    () => expenseSlices.reduce((total, slice) => total + slice.amount, 0),
    [expenseSlices],
  );

  let accumulatedOffset = 0;

  return (
    <main data-component-id="reports-page" className="mx-auto max-w-7xl pb-8 pt-4">
      <header data-component-id="reports-page-header" className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Expense Reports
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Category-wise split of all your expenses.
        </p>
      </header>

      {expenseSlices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-100/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/45 dark:text-slate-400">
          Add expense transactions to see the pie chart report.
        </p>
      ) : (
        <section data-component-id="reports-content" className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <article className="fin-card rounded-2xl p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Expense Pie
            </h2>
            <div className="relative mt-4 flex items-center justify-center">
              <svg
                data-component-id="reports-expense-pie-chart"
                width="240"
                height="240"
                viewBox="0 0 240 240"
                aria-label="Expense category pie chart"
              >
                <g transform="translate(120 120) rotate(-90)">
                  {expenseSlices.map((slice) => {
                    const strokeLength =
                      (slice.percentage / 100) * CIRCUMFERENCE;
                    const segment = (
                      <circle
                        key={slice.category}
                        r={RADIUS}
                        cx={0}
                        cy={0}
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={42}
                        strokeLinecap="butt"
                        strokeDasharray={`${strokeLength} ${CIRCUMFERENCE - strokeLength}`}
                        strokeDashoffset={-accumulatedOffset}
                        onMouseMove={(event) => {
                          const bounds = event.currentTarget
                            .ownerSVGElement
                            ?.getBoundingClientRect();
                          if (!bounds) {
                            return;
                          }
                          setTooltip({
                            x: event.clientX - bounds.left + 12,
                            y: event.clientY - bounds.top + 12,
                            slice,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                    accumulatedOffset += strokeLength;
                    return segment;
                  })}
                </g>
              </svg>
              {tooltip ? (
                <div
                  data-component-id="reports-pie-tooltip"
                  className="pointer-events-none absolute z-10 rounded-lg border border-slate-300 bg-white/95 px-2.5 py-1.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900/95"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {tooltip.slice.category}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {formatCurrency(tooltip.slice.amount, currency)} (
                    {tooltip.slice.percentage.toFixed(1)}%)
                  </p>
                </div>
              ) : null}
            </div>
            <p className="mt-2 text-center text-sm text-slate-700 dark:text-slate-300">
              Total: {formatCurrency(totalExpenseAmount, currency)}
            </p>
          </article>

          <article className="fin-card rounded-2xl p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Spend Percentage by Category
            </h2>
            <ul
              data-component-id="reports-category-breakdown"
              className="mt-3 space-y-2"
            >
              {expenseSlices.map((slice) => (
                <li
                  key={slice.category}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 px-3 py-2 text-sm dark:border-slate-700/80"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                      aria-hidden="true"
                    />
                    <span className="text-slate-800 dark:text-slate-200">
                      {slice.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {slice.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatCurrency(slice.amount, currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}
    </main>
  );
};
