import type { CurrencyCode } from "../store/slices/settingsSlice";

interface PreferencesSectionProps {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

const currencyOptions: { code: CurrencyCode; label: string }[] = [
  { code: "INR", label: "INR (₹)" },
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
];

export const PreferencesSection = ({
  currency,
  onCurrencyChange,
}: PreferencesSectionProps) => (
  <section data-component-id="settings-preferences-section" className="fin-card rounded-2xl p-5">
    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Preferences</h2>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Set your default currency format.</p>

    <label className="mt-4 block text-sm text-slate-700 dark:text-slate-300">
      Currency
      <select
        data-component-id="settings-currency-select"
        value={currency}
        onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
        className="fin-select mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-black/80 dark:text-slate-100"
      >
        {currencyOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  </section>
);
