import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addCategory,
  removeCategory,
  setCurrency,
  setTheme,
  setUsername,
  type CategoryType,
  type CurrencyCode,
  type ThemePreference,
} from "../store/slices/settingsSlice";
import { AppearanceSection } from "./AppearanceSection";
import { PreferencesSection } from "./PreferencesSection";
import { ProfileSection } from "./ProfileSection";
import { CategoriesSection } from "./CategoriesSection";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  return (
    <main data-component-id="settings-page" className="mx-auto max-w-7xl pb-8 pt-4">
      <header data-component-id="settings-page-header" className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Control app behavior, personalization, and your data.
        </p>
      </header>

      <section
        data-component-id="settings-grid"
        className="grid gap-4 lg:grid-cols-2"
      >
        <AppearanceSection
          theme={settings.theme}
          onThemeChange={(theme: ThemePreference) => dispatch(setTheme(theme))}
        />
        <PreferencesSection
          currency={settings.currency}
          onCurrencyChange={(currency: CurrencyCode) => dispatch(setCurrency(currency))}
        />
        <ProfileSection
          username={settings.username}
          onUsernameChange={(value) => dispatch(setUsername(value))}
        />
        <CategoriesSection
          categories={settings.categories}
          onAddCategory={(type: CategoryType, category: string) =>
            dispatch(addCategory({ type, category }))
          }
          onRemoveCategory={(type: CategoryType, category: string) =>
            dispatch(removeCategory({ type, category }))
          }
        />
      </section>
    </main>
  );
};
