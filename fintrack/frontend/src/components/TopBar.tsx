interface TopBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const TopBar = ({ isSidebarOpen, onToggleSidebar }: TopBarProps) => {
  const tickerItems = [
    "Invest at least 20% of your monthly income before discretionary spending.",
    "Small daily savings compound into long-term financial freedom.",
    "Track expenses weekly to spot hidden spending leaks early.",
    "Emergency funds should ideally cover 3 to 6 months of expenses.",
  ];

  return (
    <header
      data-component-id="top-header"
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-300/80 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-[#070d1e]/95"
    >
      <div
        data-component-id="top-header-main-row"
        className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <div data-component-id="top-header-left" className="flex items-center gap-3">
          <button
            data-component-id="menu-hamburger-button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-violet-400/50 hover:text-violet-700 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:text-white"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            ☰
          </button>
          <div data-component-id="brand-block" className="flex items-center gap-2">
            <div data-component-id="brand-icon" className="rounded-lg bg-violet-500/20 px-2 py-1 text-sm">
              📈
            </div>
            <p data-component-id="brand-title" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              FinTrack
            </p>
          </div>
        </div>
        {/* <div data-component-id="top-header-right" className="flex items-center gap-3">
          <button
            data-component-id="login-button"
            className="rounded-lg border border-violet-400/60 bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-800 transition hover:bg-violet-200 dark:border-violet-400/50 dark:bg-violet-500/20 dark:text-violet-100 dark:hover:bg-violet-500/35"
          >
            Login
          </button>
          <div
            data-component-id="profile-avatar"
            className="h-8 w-8 rounded-full border border-slate-600/80 bg-gradient-to-tr from-violet-500 to-cyan-400"
          />
        </div> */}
      </div>
      <div data-component-id="advice-ticker-strip" className="h-8 overflow-hidden border-t border-slate-300/80 bg-slate-100/80 dark:border-slate-800/80 dark:bg-slate-900/60">
        <div
          data-component-id="advice-ticker-track"
          className="ticker-track flex h-full items-center gap-10 whitespace-nowrap px-4 text-xs text-slate-700 dark:text-slate-300 sm:px-6 lg:px-8"
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              data-component-id={`advice-ticker-item-${index}`}
              className="inline-flex items-center gap-2"
            >
              <span className="text-violet-300">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};
