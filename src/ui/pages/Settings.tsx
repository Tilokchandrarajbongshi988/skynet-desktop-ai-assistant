type SettingsProps = {
  setupData: LunaSettings;
};

function Settings({ setupData }: SettingsProps) {
  return (
    <section className="p-8">
      <p className="text-sm font-medium text-cyan-700">Settings</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Settings</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Setup data is now stored locally in SQLite through Electron IPC.
      </p>

      <dl className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-slate-500">User name</dt>
          <dd className="text-sm font-medium text-slate-900">{setupData.userName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-slate-500">Assistant name</dt>
          <dd className="text-sm font-medium text-slate-900">{setupData.assistantName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-slate-500">Theme</dt>
          <dd className="text-sm font-medium text-slate-900">{setupData.theme}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-slate-500">Response style</dt>
          <dd className="text-sm font-medium text-slate-900">{setupData.responseStyle}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-slate-500">Model</dt>
          <dd className="text-sm font-medium text-slate-900">{setupData.modelName}</dd>
        </div>
      </dl>
    </section>
  );
}

export default Settings;
