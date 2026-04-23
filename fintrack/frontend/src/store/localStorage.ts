import { initialInsightState } from "./slices/insightSlice";
import {
  initialSettingsState,
  type SettingsState,
} from "./slices/settingsSlice";
import {
  initialTransactionState,
} from "./slices/transactionSlice";
import type { Transaction } from "../types/finance";
import type { InsightState } from "./slices/insightSlice";

const STORAGE_KEY = "fintrack-redux-state-v1";

interface PersistedState {
  settings: SettingsState;
  transactions: Transaction[];
  insight: Pick<InsightState, "summary" | "insights" | "suggestions">;
}

const isCurrency = (value: unknown): value is SettingsState["currency"] =>
  value === "INR" || value === "USD" || value === "EUR";

const isTheme = (value: unknown): value is SettingsState["theme"] =>
  value === "light" || value === "dark" || value === "system";

const sanitizeCategoryList = (
  value: unknown,
  fallback: string[],
): string[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }
  const cleaned = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return cleaned.length > 0 ? cleaned : fallback;
};

const sanitizeInsightState = (
  value: unknown,
): Pick<InsightState, "summary" | "insights" | "suggestions"> => {
  if (!value || typeof value !== "object") {
    return {
      summary: initialInsightState.summary,
      insights: initialInsightState.insights,
      suggestions: initialInsightState.suggestions,
    };
  }
  const raw = value as Partial<InsightState>;
  return {
    summary: typeof raw.summary === "string" ? raw.summary : "",
    insights: Array.isArray(raw.insights)
      ? raw.insights.filter((item): item is string => typeof item === "string")
      : [],
    suggestions: Array.isArray(raw.suggestions)
      ? raw.suggestions.filter((item): item is string => typeof item === "string")
      : [],
  };
};

export const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const settings = parsed.settings ?? initialSettingsState;

    return {
      settings: {
        theme: isTheme(settings.theme) ? settings.theme : initialSettingsState.theme,
        currency: isCurrency(settings.currency)
          ? settings.currency
          : initialSettingsState.currency,
        username:
          typeof settings.username === "string"
            ? settings.username
            : initialSettingsState.username,
        categories: {
          income: sanitizeCategoryList(
            settings.categories?.income,
            initialSettingsState.categories.income,
          ),
          expense: sanitizeCategoryList(
            settings.categories?.expense,
            initialSettingsState.categories.expense,
          ),
        },
      },
      transaction: {
        transactions: Array.isArray(parsed.transactions)
          ? parsed.transactions
          : initialTransactionState.transactions,
      },
      insight: {
        ...initialInsightState,
        ...sanitizeInsightState(
          parsed.insight ??
            (Array.isArray((parsed as { insights?: unknown }).insights)
              ? { insights: (parsed as { insights?: unknown }).insights }
              : undefined),
        ),
      },
    };
  } catch {
    return undefined;
  }
};

export const savePersistedState = (state: PersistedState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
