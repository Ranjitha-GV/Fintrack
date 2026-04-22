import type { CurrencyCode } from "../store/slices/settingsSlice";

const localeByCurrency: Record<CurrencyCode, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
};

export const formatCurrency = (amount: number, currency: CurrencyCode = "INR"): string =>
  new Intl.NumberFormat(localeByCurrency[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
