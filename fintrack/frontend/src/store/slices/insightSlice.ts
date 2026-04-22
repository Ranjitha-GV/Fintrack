import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Insight } from "../../types/finance";

interface InsightState {
  insights: Insight[];
}

export const initialInsightState: InsightState = {
  insights: [],
};

const insightSlice = createSlice({
  name: "insight",
  initialState: initialInsightState,
  reducers: {
    setInsights: (state, action: PayloadAction<Insight[]>) => {
      state.insights = action.payload;
    },
  },
});

export const { setInsights } = insightSlice.actions;
export default insightSlice.reducer;
