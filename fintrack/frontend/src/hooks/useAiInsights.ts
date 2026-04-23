import { useEffect, useMemo } from "react";
import { isAxiosError } from "axios";
import { financeApi } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setInsightError,
  setInsightLoading,
  setInsights,
  setSuggestions,
  setSummary,
} from "../store/slices/insightSlice";
import { buildAiSummaryPayload } from "../utils/aiSummary";
import type { AiInsightsResponse } from "../types/finance";

const REQUEST_COOLDOWN_MS = 2 * 60 * 1000;
const ATTEMPT_COOLDOWN_MS = 45 * 1000;

let lastPayloadKey = "";
let lastFetchedAt = 0;
let lastResponseCache: AiInsightsResponse | null = null;
let inFlightPromise: Promise<AiInsightsResponse> | null = null;
let inFlightPayloadKey = "";
let lastAttemptedPayloadKey = "";
let lastAttemptedAt = 0;

export const useAiInsights = (enabled: boolean) => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transaction.transactions);

  const summaryPayload = useMemo(
    () => buildAiSummaryPayload(transactions),
    [transactions],
  );
  const payloadKey = useMemo(() => JSON.stringify(summaryPayload), [summaryPayload]);

  useEffect(() => {
    // Fetch only when caller explicitly enables it.
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const fetchAiInsights = async () => {
      const now = Date.now();
      const isSamePayload = payloadKey === lastPayloadKey;
      const isCacheFresh = now - lastFetchedAt < REQUEST_COOLDOWN_MS;
      if (isSamePayload && isCacheFresh && lastResponseCache) {
        dispatch(setInsightError(null));
        dispatch(setSummary(lastResponseCache.summary));
        dispatch(setInsights(lastResponseCache.insights));
        dispatch(setSuggestions(lastResponseCache.suggestions));
        dispatch(setInsightLoading(false));
        return;
      }

      const isRecentAttempt =
        payloadKey === lastAttemptedPayloadKey &&
        now - lastAttemptedAt < ATTEMPT_COOLDOWN_MS;

      if (isRecentAttempt && !inFlightPromise) {
        dispatch(setInsightLoading(false));
        return;
      }

      dispatch(setInsightLoading(true));
      dispatch(setInsightError(null));

      try {
        lastAttemptedPayloadKey = payloadKey;
        lastAttemptedAt = now;

        const request =
          inFlightPromise && inFlightPayloadKey === payloadKey
            ? inFlightPromise
            : financeApi.getAiInsights(summaryPayload);
        inFlightPromise = request;
        inFlightPayloadKey = payloadKey;

        const response = await request;
        if (inFlightPromise === request) {
          inFlightPromise = null;
          inFlightPayloadKey = "";
        }
        if (cancelled) {
          return;
        }
        lastPayloadKey = payloadKey;
        lastFetchedAt = Date.now();
        lastResponseCache = response;
        dispatch(setSummary(response.summary));
        dispatch(setInsights(response.insights));
        dispatch(setSuggestions(response.suggestions));
      } catch (error) {
        inFlightPromise = null;
        inFlightPayloadKey = "";
        if (cancelled) {
          return;
        }

        if (
          isAxiosError(error) &&
          error.response?.status === 429 &&
          payloadKey === lastPayloadKey &&
          lastResponseCache
        ) {
          dispatch(setInsightError(null));
          dispatch(setSummary(lastResponseCache.summary));
          dispatch(setInsights(lastResponseCache.insights));
          dispatch(setSuggestions(lastResponseCache.suggestions));
          return;
        }

        let message = "Unable to fetch AI insights right now.";
        if (isAxiosError<{ message?: string }>(error)) {
          message = error.response?.data?.message || message;
        }
        if (
          /high demand|rate limit/i.test(message)
        ) {
          message =
            "Processing is taking longer than usual due to high demand. Please retry shortly.";
        }
        dispatch(setInsightError(message));
      } finally {
        if (!cancelled) {
          dispatch(setInsightLoading(false));
        }
      }
    };

    void fetchAiInsights();

    return () => {
      cancelled = true;
    };
  }, [dispatch, enabled, payloadKey, summaryPayload]);
};
