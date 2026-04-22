interface ProfileSectionProps {
  username: string;
  onUsernameChange: (value: string) => void;
}

export const ProfileSection = ({
  username,
  onUsernameChange,
}: ProfileSectionProps) => (
  <section data-component-id="settings-profile-section" className="fin-card rounded-2xl p-5">
    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Personalize your workspace identity.</p>

    <label className="mt-4 block text-sm text-slate-700 dark:text-slate-300">
      Username
      <input
        data-component-id="settings-username-input"
        type="text"
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
        placeholder="Enter your name"
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
      />
    </label>
  </section>
);
