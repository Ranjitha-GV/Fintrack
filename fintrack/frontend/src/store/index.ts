import { configureStore } from "@reduxjs/toolkit";
import insightReducer from "./slices/insightSlice";
import settingsReducer from "./slices/settingsSlice";
import transactionReducer from "./slices/transactionSlice";
import { loadPersistedState, savePersistedState } from "./localStorage";

const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    transaction: transactionReducer,
    insight: insightReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  savePersistedState({
    settings: state.settings,
    transactions: state.transaction.transactions,
    insight: {
      summary: state.insight.summary,
      insights: state.insight.insights,
      suggestions: state.insight.suggestions,
    },
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
