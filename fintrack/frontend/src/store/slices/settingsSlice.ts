import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemePreference = "light" | "dark" | "system";
export type CurrencyCode = "INR" | "USD" | "EUR";
export type CategoryType = "income" | "expense";

export interface CategoryMap {
  income: string[];
  expense: string[];
}

export interface SettingsState {
  theme: ThemePreference;
  currency: CurrencyCode;
  username: string;
  categories: CategoryMap;
}

export const initialSettingsState: SettingsState = {
  theme: "dark",
  currency: "INR",
  username: "Aarav Sharma",
  categories: {
    income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
    expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Other"],
  },
};

interface CategoryPayload {
  type: CategoryType;
  category: string;
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemePreference>) => {
      state.theme = action.payload;
    },
    setCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.currency = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    addCategory: (state, action: PayloadAction<CategoryPayload>) => {
      const category = action.payload.category.trim();
      if (!category) {
        return;
      }

      const exists = state.categories[action.payload.type].some(
        (item) => item.toLowerCase() === category.toLowerCase(),
      );

      if (!exists) {
        state.categories[action.payload.type].push(category);
      }
    },
    removeCategory: (state, action: PayloadAction<CategoryPayload>) => {
      const list = state.categories[action.payload.type];
      if (list.length <= 1) {
        return;
      }
      state.categories[action.payload.type] = list.filter(
        (item) => item !== action.payload.category,
      );
    },
    resetSettings: () => initialSettingsState,
  },
});

export const {
  setTheme,
  setCurrency,
  setUsername,
  addCategory,
  removeCategory,
  resetSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
