import type { ThemePreference } from "../store/slices/settingsSlice";

interface AppearanceSectionProps {
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}

const themes: ThemePreference[] = ["light", "dark", "system"];

export const AppearanceSection = ({ theme, onThemeChange }: AppearanceSectionProps) => (
  <section
    data-component-id="settings-appearance-section"
    className="fin-card rounded-2xl p-5"
  >
    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
      Appearance
    </h2>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
      Choose how FinTrack looks across your devices.
    </p>
    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-200/80 p-1 dark:bg-slate-900/60">
      {themes.map((option) => (
        <button
          key={option}
          data-component-id={`settings-theme-${option}`}
          onClick={() => onThemeChange(option)}
          className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
            theme === option
              ? "bg-violet-600 text-white"
              : "text-slate-700 hover:bg-slate-300/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </section>
);
