import { useState } from "react";
import type { CategoryMap, CategoryType } from "../store/slices/settingsSlice";

interface CategoriesSectionProps {
  categories: CategoryMap;
  onAddCategory: (type: CategoryType, category: string) => void;
  onRemoveCategory: (type: CategoryType, category: string) => void;
}

export const CategoriesSection = ({
  categories,
  onAddCategory,
  onRemoveCategory,
}: CategoriesSectionProps) => {
  const [activeType, setActiveType] = useState<CategoryType>("expense");
  const [input, setInput] = useState("");

  return (
    <section data-component-id="settings-categories-section" className="fin-card rounded-2xl p-5">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Categories
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Add or remove transaction categories used in quick entry.
      </p>

      <div className="mt-4 inline-flex rounded-xl bg-slate-200/80 p-1 dark:bg-slate-900/60">
        {(["expense", "income"] as const).map((type) => (
          <button
            key={type}
            data-component-id={`settings-categories-tab-${type}`}
            onClick={() => setActiveType(type)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
              activeType === type
                ? "bg-violet-600 text-white"
                : "text-slate-700 hover:bg-slate-300/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories[activeType].map((category) => (
          <span
            key={category}
            data-component-id={`settings-category-chip-${activeType}-${category.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
          >
            {category}
            <button
              data-component-id={`settings-remove-category-${activeType}-${category.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onRemoveCategory(activeType, category)}
              className="text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
              aria-label={`Remove ${category}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <form
        data-component-id="settings-add-category-form"
        onSubmit={(event) => {
          event.preventDefault();
          onAddCategory(activeType, input);
          setInput("");
        }}
        className="mt-4 flex gap-2"
      >
        <input
          data-component-id="settings-add-category-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Add ${activeType} category`}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
        />
        <button
          data-component-id="settings-add-category-button"
          type="submit"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Add
        </button>
      </form>
    </section>
  );
};
