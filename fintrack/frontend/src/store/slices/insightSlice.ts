import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface InsightState {
  summary: string;
  insights: string[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
}

export const initialInsightState: InsightState = {
  summary: "",
  insights: [],
  suggestions: [],
  loading: false,
  error: null,
};

const insightSlice = createSlice({
  name: "insight",
  initialState: initialInsightState,
  reducers: {
    setSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },
    setInsights: (state, action: PayloadAction<string[]>) => {
      state.insights = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    setInsightLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInsightError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetInsights: () => initialInsightState,
  },
});

export const {
  setSummary,
  setInsights,
  setSuggestions,
  setInsightLoading,
  setInsightError,
  resetInsights,
} = insightSlice.actions;
export default insightSlice.reducer;
