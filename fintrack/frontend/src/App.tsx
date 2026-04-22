import { useEffect, useState } from "react";
import { Sidebar, type AppView } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { SettingsPage } from "./settings/SettingsPage";
import { useAppSelector } from "./store/hooks";

const resolveTheme = (theme: "light" | "dark" | "system") => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
};

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const theme = useAppSelector((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const resolved = resolveTheme(theme);
      root.classList.toggle("dark", resolved === "dark");
      root.style.colorScheme = resolved;
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 180);
    };

    applyTheme();
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  return (
    <div data-component-id="app-shell" className="min-h-screen">
      <TopBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setSidebarOpen((current) => !current)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
      />
      {isSidebarOpen && (
        <button
          data-component-id="sidebar-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-x-0 bottom-0 top-24 z-30 bg-black/40 lg:hidden"
          aria-label="Close menu backdrop"
        />
      )}
      <div
        data-component-id="dashboard-content-wrap"
        className={`px-4 pb-4 pt-[6.5rem] transition-[margin] duration-200 sm:px-6 lg:px-8 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {activeView === "dashboard" && <DashboardPage />}
        {activeView === "transactions" && <TransactionsPage />}
        {activeView === "settings" && <SettingsPage />}
      </div>
    </div>
  );
};

export default App;
