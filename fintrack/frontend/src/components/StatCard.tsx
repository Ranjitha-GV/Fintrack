interface StatCardProps {
  label: string;
  value: string;
  accent: "violet" | "green" | "red";
  trend: string;
}

const accentClasses: Record<StatCardProps["accent"], string> = {
  violet: "text-violet-700 dark:text-violet-200",
  green: "text-emerald-700 dark:text-emerald-300",
  red: "text-rose-700 dark:text-rose-300",
};

const sparklinePoints: Record<StatCardProps["accent"], string> = {
  violet: "4,28 20,30 34,24 49,27 66,19 84,23 101,16 118,19 136,11 156,12",
  green: "4,25 22,21 38,23 56,17 74,19 90,13 108,16 126,11 142,14 156,8",
  red: "4,24 20,20 38,22 56,15 73,17 91,13 110,16 126,10 144,12 156,7",
};

const strokeClasses: Record<StatCardProps["accent"], string> = {
  violet: "stroke-violet-400",
  green: "stroke-emerald-400",
  red: "stroke-rose-400",
};

export const StatCard = ({ label, value, accent, trend }: StatCardProps) => (
  <article data-component-id={`stat-card-${accent}`} className="fin-card rounded-2xl p-3.5">
    <p data-component-id={`stat-card-label-${accent}`} className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
      {label}
    </p>
    <p data-component-id={`stat-card-value-${accent}`} className={`mt-1.5 text-xl font-semibold ${accentClasses[accent]}`}>
      {value}
    </p>
    <p data-component-id={`stat-card-trend-${accent}`} className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
      {trend}
    </p>
    <svg
      data-component-id={`stat-card-graph-${accent}`}
      className="mt-2.5 h-8 w-full"
      viewBox="0 0 160 36"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={sparklinePoints[accent]}
        className={`fill-none stroke-2 ${strokeClasses[accent]}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </article>
);
