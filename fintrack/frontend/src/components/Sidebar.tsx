export type AppView =
  | "dashboard"
  | "transactions"
  | "insights"
  | "reports"
  | "settings";

interface SidebarMenuItem {
  label: string;
  view?: AppView;
}

const menuItems = [
  { label: "Dashboard", view: "dashboard" },
  { label: "Transactions", view: "transactions" },
  { label: "AI Insights", view: "insights" },
  { label: "Reports", view: "reports" },
  { label: "Settings", view: "settings" },
] satisfies SidebarMenuItem[];

interface SidebarProps {
  isOpen: boolean;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Sidebar = ({ isOpen, activeView, onNavigate }: SidebarProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <aside
      data-component-id="left-sidebar"
      className="fin-card fixed bottom-0 left-0 top-24 z-40 w-64 shrink-0 overflow-y-auto border-r border-r-slate-300/80 p-5 dark:border-r-slate-800/60"
    >
      <nav data-component-id="left-sidebar-nav" className="space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.label}
            data-component-id={`left-sidebar-nav-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              if (item.view) {
                onNavigate(item.view);
              }
            }}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
              item.view && activeView === item.view
                ? "glow-purple bg-violet-500/15 text-slate-900 dark:text-slate-100"
                : item.view
                  ? "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                  : "cursor-default text-slate-500 dark:text-slate-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
