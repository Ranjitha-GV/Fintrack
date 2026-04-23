import { useState } from "react";
import { useAiInsights } from "../hooks/useAiInsights";
import { useAppSelector } from "../store/hooks";

export const InsightsPage = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  useAiInsights(shouldFetch);
  const summary = useAppSelector((state) => state.insight.summary);
  const insights = useAppSelector((state) => state.insight.insights);
  const suggestions = useAppSelector((state) => state.insight.suggestions);
  const loading = useAppSelector((state) => state.insight.loading);
  const error = useAppSelector((state) => state.insight.error);

  return (
    <main data-component-id="insights-page" className="mx-auto max-w-7xl pb-8 pt-4">
      <header data-component-id="insights-page-header" className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          AI Insights
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Full AI-generated spending summary and recommendations.
        </p>
        <div className="mt-3">
          <button
            data-component-id="insights-fetch-button"
            type="button"
            onClick={() => setShouldFetch(true)}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate AI Insights"}
          </button>
        </div>
      </header>

      {!shouldFetch ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-100/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/45 dark:text-slate-400">
          Click &quot;Generate AI Insights&quot; to fetch from Gemini.
        </p>
      ) : loading ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-100/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/45 dark:text-slate-400">
          Generating full AI summary...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-dashed border-rose-300 bg-rose-100/70 p-4 text-sm text-rose-700 dark:border-rose-700 dark:bg-rose-950/45 dark:text-rose-300">
          {error}
        </p>
      ) : (
        <section data-component-id="insights-page-content" className="grid gap-4 lg:grid-cols-3">
          <article className="fin-card rounded-2xl p-5 lg:col-span-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Full Summary
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {summary || "No summary available yet."}
            </p>
          </article>

          <article className="fin-card rounded-2xl p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Key Insights
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {insights.length > 0 ? (
                insights.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))
              ) : (
                <li>No insights yet.</li>
              )}
            </ul>
          </article>

          <article className="fin-card rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Suggestions
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))
              ) : (
                <li>No suggestions yet.</li>
              )}
            </ul>
          </article>
        </section>
      )}
    </main>
  );
};
