type SettingsProps = {
  setupData: SkynetSettings;
};

function Settings({ setupData }: SettingsProps) {
  return (
    <section className="min-h-screen bg-white p-8">
      <p className="inline-block border border-black bg-yellow-300 px-3 py-1 text-sm font-semibold text-black">Settings</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">Settings</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
        Setup data is now stored locally in SQLite through Electron IPC.
      </p>

      <dl className="mt-6 grid gap-3 rounded-md border border-black bg-white p-5">
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-zinc-600">User name</dt>
          <dd className="text-sm font-semibold text-black">{setupData.userName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-zinc-600">Assistant name</dt>
          <dd className="text-sm font-semibold text-black">{setupData.assistantName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-zinc-600">Theme</dt>
          <dd className="text-sm font-semibold text-black">{setupData.theme}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-zinc-600">Response style</dt>
          <dd className="text-sm font-semibold text-black">{setupData.responseStyle}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-zinc-600">Model</dt>
          <dd className="text-sm font-semibold text-black">{setupData.modelName}</dd>
        </div>
      </dl>
    </section>
  );
}

export default Settings;
