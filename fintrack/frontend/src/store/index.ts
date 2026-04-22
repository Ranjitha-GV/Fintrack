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
    insights: state.insight.insights,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
