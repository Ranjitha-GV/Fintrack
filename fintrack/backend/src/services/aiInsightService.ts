import type {
  AiInsightsResponse,
  AiSummaryInput,
} from "../types/aiInsight";
import { callGeminiWithFallback } from "./geminiClient";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "string" && item.trim().length > 0);

const isAiInsightsResponse = (value: unknown): value is AiInsightsResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const parsed = value as Partial<AiInsightsResponse>;
  return (
    typeof parsed.summary === "string" &&
    parsed.summary.trim().length > 0 &&
    isStringArray(parsed.insights) &&
    isStringArray(parsed.suggestions)
  );
};

const sanitizeResponse = (value: AiInsightsResponse): AiInsightsResponse => ({
  summary: value.summary.trim(),
  insights: value.insights.map((item) => item.trim()).slice(0, 5),
  suggestions: value.suggestions.map((item) => item.trim()).slice(0, 5),
});

export const generateAiInsights = async (
  summary: AiSummaryInput,
): Promise<AiInsightsResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = JSON.stringify({
    task: "Analyze this finance summary and provide useful guidance.",
    input: summary,
    response_schema: {
      summary: "string",
      insights: ["string"],
      suggestions: ["string"],
    },
    instructions: [
      "Return strict JSON only with keys: summary, insights, suggestions.",
      "summary must be a concise paragraph.",
      "insights and suggestions must be arrays of short actionable strings.",
    ],
  });

  let raw = "";
  try {
    raw = await callGeminiWithFallback({
      apiKey,
      prompt,
      models: [
        process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
        "gemini-1.5-flash",
      ],
      temperature: 0.3,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gemini request failed.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  if (!isAiInsightsResponse(parsed)) {
    throw new Error("AI response shape is invalid");
  }

  return sanitizeResponse(parsed);
};
