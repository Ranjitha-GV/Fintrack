import type { Request, Response } from "express";
import { generateAiInsights } from "../services/aiInsightService";
import type {
  AiInsightsRequestBody,
  AiInsightsResponse,
  AiSummaryInput,
} from "../types/aiInsight";

const hasValidSummary = (payload: unknown): payload is AiSummaryInput => {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  const value = payload as Partial<AiSummaryInput>;
  return (
    typeof value.totalSpent === "number" &&
    Number.isFinite(value.totalSpent) &&
    typeof value.totalIncome === "number" &&
    Number.isFinite(value.totalIncome) &&
    typeof value.topCategory === "string" &&
    value.topCategory.trim().length > 0 &&
    typeof value.topCategoryAmount === "number" &&
    Number.isFinite(value.topCategoryAmount) &&
    typeof value.weeklyChange === "number" &&
    Number.isFinite(value.weeklyChange) &&
    typeof value.topSpendingDay === "string" &&
    value.topSpendingDay.trim().length > 0
  );
};

const buildRateLimitFallback = (summary: AiSummaryInput): AiInsightsResponse => {
  const net = summary.totalIncome - summary.totalSpent;
  const direction = summary.weeklyChange >= 0 ? "up" : "down";
  const weeklyDelta = Math.abs(summary.weeklyChange).toFixed(1);

  return {
    summary: `You earned ${summary.totalIncome.toFixed(0)}, spent ${summary.totalSpent.toFixed(
      0,
    )}, and your net balance is ${net.toFixed(0)}.`,
    insights: [
      `Top spending category is ${summary.topCategory} (${summary.topCategoryAmount.toFixed(0)}).`,
      `Weekly spend trend is ${direction} by ${weeklyDelta}%.`,
      `Highest spending day is ${summary.topSpendingDay}.`,
    ],
    suggestions: [
      `Set a weekly cap for ${summary.topCategory} to reduce overspend.`,
      "Review your highest-spending day and pre-plan purchases.",
      "Retry AI insights in a minute for a richer personalized breakdown.",
    ],
  };
};

export const postAiInsights = async (
  req: Request<unknown, unknown, AiInsightsRequestBody>,
  res: Response,
): Promise<void> => {
  const payload = req.body?.summary;
  if (!hasValidSummary(payload)) {
    res.status(400).json({ message: "Invalid summary payload" });
    return;
  }

  try {
    const aiInsights = await generateAiInsights(payload);
    res.json(aiInsights);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "GEMINI_API_KEY is not configured") {
      res.status(500).json({ message: "AI provider is not configured" });
      return;
    }
    if (
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("high demand")
    ) {
      res.setHeader("x-insights-fallback", "rate-limit");
      res.json(buildRateLimitFallback(payload));
      return;
    }
    res.status(502).json({ message });
  }
};
