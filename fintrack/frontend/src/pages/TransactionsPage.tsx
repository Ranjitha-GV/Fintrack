import { useMemo, useState } from "react";
import { AddTransactionForm } from "../components/AddTransactionForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteTransaction, updateTransaction } from "../store/slices/transactionSlice";
import type { Transaction, TransactionFilter, TransactionPayload } from "../types/finance";
import { formatCurrency, formatDate } from "../utils/format";

interface GroupedTransactions {
  monthKey: string;
  monthLabel: string;
  totalIncome: number;
  totalExpense: number;
  items: {
    id: string;
    category: string;
    type: "income" | "expense";
    amount: number;
    date: string;
  }[];
}

const filters: TransactionFilter[] = ["all", "income", "expense"];

export const TransactionsPage = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null,
  );
  const [pendingDeleteTransaction, setPendingDeleteTransaction] =
    useState<Transaction | null>(null);
  const transactions = useAppSelector((state) => state.transaction.transactions);
  const currency = useAppSelector((state) => state.settings.currency);
  const categoriesByType = useAppSelector((state) => state.settings.categories);

  const grouped = useMemo(() => {
    const filtered =
      filter === "all"
        ? transactions
        : transactions.filter((transaction) => transaction.type === filter);

    const map = new Map<string, GroupedTransactions>();
    for (const transaction of filtered) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!map.has(monthKey)) {
        map.set(monthKey, {
          monthKey,
          monthLabel,
          totalIncome: 0,
          totalExpense: 0,
          items: [],
        });
      }

      const group = map.get(monthKey)!;
      group.items.push({
        id: transaction.id,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
      });

      if (transaction.type === "income") {
        group.totalIncome += transaction.amount;
      } else {
        group.totalExpense += transaction.amount;
      }
    }

    return [...map.values()].sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [filter, transactions]);

  return (
    <main data-component-id="transactions-page" className="mx-auto max-w-7xl pb-8 pt-4">
      <header
        data-component-id="transactions-page-header"
        className="mb-4 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Transactions
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review your transaction history grouped by month.
          </p>
        </div>
        <div
          data-component-id="transactions-page-filter-tabs"
          className="rounded-xl bg-slate-200/80 p-1 dark:bg-slate-900/70"
        >
          {filters.map((item) => (
            <button
              key={item}
              data-component-id={`transactions-page-tab-${item}`}
              onClick={() => setFilter(item)}
              className={`rounded-md px-3 py-1 text-sm capitalize transition ${
                filter === item
                  ? "bg-violet-500 text-white"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      {grouped.length === 0 ? (
        <p
          data-component-id="transactions-page-empty-state"
          className="rounded-xl border border-dashed border-slate-300 bg-slate-100/80 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/45 dark:text-slate-400"
        >
          No transactions found for this filter.
        </p>
      ) : (
        <section data-component-id="transactions-page-month-groups" className="space-y-4">
          {grouped.map((group) => (
            <article
              key={group.monthKey}
              data-component-id={`transactions-month-group-${group.monthKey}`}
              className="fin-card rounded-2xl p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {group.monthLabel}
                </h2>
                <div className="flex gap-3 text-xs">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-700 dark:text-emerald-300">
                    Income: {formatCurrency(group.totalIncome, currency)}
                  </span>
                  <span className="rounded-full bg-rose-500/20 px-2 py-1 text-rose-700 dark:text-rose-300">
                    Expense: {formatCurrency(group.totalExpense, currency)}
                  </span>
                </div>
              </div>

              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    data-component-id={`transactions-page-item-${item.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white/80 px-3 py-2 dark:border-slate-800/70 dark:bg-slate-900/50"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.category}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          item.type === "income"
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {item.type}
                      </span>
                      <p
                        className={`font-semibold ${
                          item.type === "income"
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {item.type === "income" ? "+" : "-"}
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <button
                        data-component-id={`transactions-page-item-edit-${item.id}`}
                        onClick={() => {
                          const transaction = transactions.find((t) => t.id === item.id);
                          if (transaction) {
                            setEditingTransaction(transaction);
                          }
                        }}
                        className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-600 transition hover:border-violet-400 hover:text-violet-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-violet-300"
                      >
                        Edit
                      </button>
                      <button
                        data-component-id={`transactions-page-item-delete-${item.id}`}
                        onClick={() => {
                          const transaction = transactions.find((t) => t.id === item.id);
                          if (transaction) {
                            setPendingDeleteTransaction(transaction);
                          }
                        }}
                        className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-600 transition hover:border-rose-400 hover:text-rose-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}

      {editingTransaction && (
        <div
          data-component-id="transactions-page-edit-modal-overlay"
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
        >
          <div
            data-component-id="transactions-page-edit-modal"
            className="w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-[#0a1127]"
          >
            <AddTransactionForm
              submitting={false}
              currency={currency}
              categoriesByType={categoriesByType}
              variant="modal"
              title="Edit Transaction"
              submitLabel="Save Changes"
              initialValues={{
                amount: editingTransaction.amount,
                type: editingTransaction.type,
                category: editingTransaction.category,
                date: editingTransaction.date,
              }}
              onCancel={() => setEditingTransaction(null)}
              onSubmit={async (payload: TransactionPayload) => {
                dispatch(
                  updateTransaction({
                    id: editingTransaction.id,
                    ...payload,
                  }),
                );
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}

      {pendingDeleteTransaction && (
        <div
          data-component-id="transactions-page-delete-modal-overlay"
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
        >
          <div
            data-component-id="transactions-page-delete-modal"
            className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-[#0a1127]"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Delete transaction?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This will delete the transaction permanently.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                data-component-id="transactions-page-delete-cancel"
                onClick={() => setPendingDeleteTransaction(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                data-component-id="transactions-page-delete-confirm"
                onClick={() => {
                  dispatch(deleteTransaction(pendingDeleteTransaction.id));
                  setPendingDeleteTransaction(null);
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
