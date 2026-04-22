import type { Insight } from "../types/finance";

const typeStyleMap: Record<Insight["type"], { icon: string; ring: string }> = {
  spike: { icon: "📈", ring: "from-violet-500/30 to-violet-400/10" },
  "top-category": { icon: "🧾", ring: "from-emerald-500/30 to-cyan-400/10" },
  habit: { icon: "🗓️", ring: "from-indigo-500/30 to-sky-400/10" },
};

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard = ({ insight }: InsightCardProps) => {
  const style = typeStyleMap[insight.type];

  return (
    <article data-component-id={`insight-card-${insight.type}`} className="fin-card rounded-2xl p-3.5">
      <p data-component-id={`insight-card-title-${insight.type}`} className="text-xs font-medium text-slate-700 dark:text-slate-300">
        <span
          data-component-id={`insight-card-icon-${insight.type}`}
          className={`mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${style.ring}`}
          aria-hidden
        >
          {style.icon}
        </span>
        Smart Insight
      </p>
      <p data-component-id={`insight-card-message-${insight.type}`} className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
        {insight.message}
      </p>
    </article>
  );
};
