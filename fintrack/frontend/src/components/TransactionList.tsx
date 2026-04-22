import { useState } from "react";
import type { Transaction, TransactionFilter } from "../types/finance";
import type { CurrencyCode } from "../store/slices/settingsSlice";
import { formatCurrency, formatDate } from "../utils/format";

interface TransactionListProps {
  transactions: Transaction[];
  filter: TransactionFilter;
  currency: CurrencyCode;
  onFilterChange: (filter: TransactionFilter) => void;
  onEdit: (transaction: Transaction) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const filters: TransactionFilter[] = ["all", "income", "expense"];

export const TransactionList = ({
  transactions,
  filter,
  currency,
  onFilterChange,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  const visibleTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.type === filter);

  return (
    <section
      data-component-id="transactions-panel"
      className="fin-card flex h-[17rem] flex-col rounded-2xl p-5"
    >
      <div data-component-id="transactions-header" className="flex flex-wrap items-center justify-between gap-3">
        <h2 data-component-id="transactions-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Transactions
        </h2>
        <div data-component-id="transactions-filter-group" className="rounded-xl bg-slate-200/80 p-1 dark:bg-slate-900/70">
          {filters.map((item) => (
            <button
              key={item}
              data-component-id={`transactions-filter-${item}`}
              onClick={() => onFilterChange(item)}
              className={`rounded-md px-3 py-1 text-sm capitalize transition ${
                filter === item
                  ? "bg-violet-500 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visibleTransactions.length === 0 ? (
        <p
          data-component-id="transactions-empty-state"
          className="mt-4 flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100/80 p-5 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
        >
          No transactions yet. Add one to get started.
        </p>
      ) : (
        <ul
          data-component-id="transactions-list"
          className="theme-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {visibleTransactions.map((transaction, index) => (
            <li
              key={transaction.id}
              data-component-id={`transactions-item-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white/80 p-3 dark:border-slate-800/70 dark:bg-slate-900/50"
            >
              <div data-component-id={`transactions-item-meta-${index}`}>
                <p data-component-id={`transactions-item-category-${index}`} className="font-medium text-slate-900 dark:text-slate-100">
                  {transaction.category}
                </p>
                <p data-component-id={`transactions-item-date-${index}`} className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <div data-component-id={`transactions-item-actions-${index}`} className="flex items-center gap-3">
                <span
                  data-component-id={`transactions-item-type-${index}`}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    transaction.type === "income"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {transaction.type}
                </span>
                <p
                  data-component-id={`transactions-item-amount-${index}`}
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, currency)}
                </p>
                <button
                  data-component-id={`transactions-item-edit-${index}`}
                  onClick={() => onEdit(transaction)}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 transition hover:border-violet-400 hover:text-violet-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-violet-300"
                >
                  Edit
                </button>
                <button
                  data-component-id={`transactions-item-delete-${index}`}
                  onClick={() => setPendingDelete(transaction)}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 transition hover:border-rose-400 hover:text-rose-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingDelete && (
        <div
          data-component-id="transactions-delete-confirm-overlay"
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
        >
          <div
            data-component-id="transactions-delete-confirm-modal"
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
                data-component-id="transactions-delete-confirm-cancel"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                data-component-id="transactions-delete-confirm-submit"
                onClick={async () => {
                  await onDelete(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
