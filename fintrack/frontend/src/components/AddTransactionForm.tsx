import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CategoryMap, CurrencyCode } from "../store/slices/settingsSlice";
import type { TransactionPayload, TransactionType } from "../types/finance";
import { FinDatePicker } from "./FinDatePicker";

interface AddTransactionFormProps {
  submitting: boolean;
  currency: CurrencyCode;
  categoriesByType: CategoryMap;
  initialValues?: TransactionPayload;
  title?: string;
  submitLabel?: string;
  onCancel?: () => void;
  variant?: "panel" | "modal";
  onSubmit: (payload: TransactionPayload) => Promise<void>;
}

const currencySymbolMap: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
};

export const AddTransactionForm = ({
  submitting,
  currency,
  categoriesByType,
  initialValues,
  title = "Add Transaction",
  submitLabel = "Add Transaction",
  onCancel,
  variant = "panel",
  onSubmit,
}: AddTransactionFormProps) => {
  const [amount, setAmount] = useState(initialValues ? String(initialValues.amount) : "");
  const [type, setType] = useState<TransactionType>(initialValues?.type ?? "expense");
  const [category, setCategory] = useState(
    initialValues?.category ?? categoriesByType.expense[0],
  );
  const [date, setDate] = useState(
    initialValues?.date
      ? new Date(initialValues.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const categories = useMemo(() => categoriesByType[type], [type]);

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0] ?? "Other");
    }
  }, [categories, category]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    setAmount(String(initialValues.amount));
    setType(initialValues.type);
    setCategory(initialValues.category);
    setDate(new Date(initialValues.date).toISOString().slice(0, 10));
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(amount);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    await onSubmit({
      amount: parsed,
      type,
      category,
      date: new Date(date).toISOString(),
    });

    if (!initialValues) {
      setAmount("");
    }
  };

  return (
    <form
      data-component-id="add-transaction-form"
      onSubmit={handleSubmit}
      className={`fin-card flex flex-col rounded-2xl p-5 ${
        variant === "panel" ? "h-[17rem]" : ""
      }`}
    >
      <h2 data-component-id="add-transaction-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <div
        data-component-id="add-transaction-fields-grid"
        className="mt-3 grid flex-1 gap-2 pr-1 sm:grid-cols-2"
      >
        <label data-component-id="add-transaction-field-amount" className="text-sm text-slate-700 dark:text-slate-300">
          Amount
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-900/60">
            <span className="mr-2 text-slate-500 dark:text-slate-400">{currencySymbolMap[currency]}</span>
            <input
              data-component-id="add-transaction-input-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full bg-transparent py-2 text-slate-900 outline-none ring-violet-500 focus:ring-0 dark:text-slate-100"
            />
          </div>
        </label>

        <label data-component-id="add-transaction-field-type" className="text-sm text-slate-700 dark:text-slate-300">
          Type
          <select
            data-component-id="add-transaction-input-type"
            value={type}
            onChange={(event) => {
              const nextType = event.target.value as TransactionType;
              setType(nextType);
              setCategory(categoriesByType[nextType][0] ?? "Other");
            }}
            className="fin-select mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-black/80 dark:text-slate-100"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label data-component-id="add-transaction-field-category" className="text-sm text-slate-700 dark:text-slate-300">
          Category
          <select
            data-component-id="add-transaction-input-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="fin-select mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-black/80 dark:text-slate-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label data-component-id="add-transaction-field-date" className="text-sm text-slate-700 dark:text-slate-300">
          Date
          <FinDatePicker value={date} onChange={setDate} />
        </label>
      </div>

      <div className="mt-3 flex shrink-0 gap-2">
        {onCancel && (
          <button
            data-component-id="add-transaction-cancel-button"
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
          >
            Cancel
          </button>
        )}
        <button
          data-component-id="add-transaction-submit-button"
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
