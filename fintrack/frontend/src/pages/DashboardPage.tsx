import { useMemo, useState } from "react";
import { AddTransactionForm } from "../components/AddTransactionForm";
import { StatCard } from "../components/StatCard";
import { TransactionList } from "../components/TransactionList";
import type { TransactionFilter } from "../types/finance";
import { formatCurrency } from "../utils/format";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../store/slices/transactionSlice";
import type { Transaction, TransactionPayload } from "../types/finance";

const isCurrentMonth = (value: string): boolean => {
  const date = new Date(value);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const isPreviousMonth = (value: string): boolean => {
  const date = new Date(value);
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return (
    date.getMonth() === previousMonth.getMonth() && date.getFullYear() === previousMonth.getFullYear()
  );
};

const formatTrend = (current: number, previous: number): string => {
  if (previous <= 0) {
    return "No comparison from last month";
  }
  const change = ((current - previous) / previous) * 100;
  const direction = change >= 0 ? "↑" : "↓";
  return `${direction} ${Math.abs(change).toFixed(1)}% from last month`;
};

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null,
  );
  const transactions = useAppSelector((state) => state.transaction.transactions);
  const currency = useAppSelector((state) => state.settings.currency);
  const categoriesByType = useAppSelector((state) => state.settings.categories);

  const stats = useMemo(() => {
    const incomeMonth = transactions
      .filter((transaction) => transaction.type === "income" && isCurrentMonth(transaction.date))
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenseMonth = transactions
      .filter((transaction) => transaction.type === "expense" && isCurrentMonth(transaction.date))
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = transactions.reduce(
      (total, transaction) =>
        transaction.type === "income"
          ? total + transaction.amount
          : total - transaction.amount,
      0,
    );

    const previousIncomeMonth = transactions
      .filter((transaction) => transaction.type === "income" && isPreviousMonth(transaction.date))
      .reduce((total, transaction) => total + transaction.amount, 0);

    const previousExpenseMonth = transactions
      .filter((transaction) => transaction.type === "expense" && isPreviousMonth(transaction.date))
      .reduce((total, transaction) => total + transaction.amount, 0);

    const previousBalance = transactions
      .filter((transaction) => isPreviousMonth(transaction.date))
      .reduce(
        (total, transaction) =>
          transaction.type === "income"
            ? total + transaction.amount
            : total - transaction.amount,
        0,
      );

    return {
      incomeMonth,
      expenseMonth,
      balance,
      incomeTrend: formatTrend(incomeMonth, previousIncomeMonth),
      expenseTrend: formatTrend(expenseMonth, previousExpenseMonth),
      balanceTrend: formatTrend(balance, previousBalance),
    };
  }, [transactions]);

  return (
    <main
      data-component-id="dashboard-main"
      className="mx-auto flex h-[calc(100vh-7rem)] max-w-7xl flex-col overflow-hidden pb-4 pt-2"
    >
      <section data-component-id="dashboard-stats-section" className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Balance"
          value={formatCurrency(stats.balance, currency)}
          accent="violet"
          trend={stats.balanceTrend}
        />
        <StatCard
          label="Income (This Month)"
          value={formatCurrency(stats.incomeMonth, currency)}
          accent="green"
          trend={stats.incomeTrend}
        />
        <StatCard
          label="Expense (This Month)"
          value={formatCurrency(stats.expenseMonth, currency)}
          accent="red"
          trend={stats.expenseTrend}
        />
      </section>

      <section
        data-component-id="dashboard-lower-section"
        className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_360px]"
      >
        <TransactionList
          transactions={transactions}
          filter={filter}
          currency={currency}
          className="h-full min-h-0"
          onFilterChange={setFilter}
          onEdit={async (transaction) => {
            setEditingTransaction(transaction);
          }}
          onDelete={async (id) => {
            dispatch(deleteTransaction(id));
          }}
        />

        <AddTransactionForm
          submitting={false}
          currency={currency}
          categoriesByType={categoriesByType}
          variant="panel"
          panelHeightClass="h-full"
          onImportTransactions={async (payloads) => {
            payloads.forEach((payload) => dispatch(addTransaction(payload)));
          }}
          onSubmit={async (payload: TransactionPayload) => {
            dispatch(addTransaction(payload));
          }}
        />
      </section>

      {editingTransaction && (
        <div
          data-component-id="edit-transaction-modal-overlay"
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
        >
          <div
            data-component-id="edit-transaction-modal"
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
              onSubmit={async (payload) => {
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
    </main>
  );
};
