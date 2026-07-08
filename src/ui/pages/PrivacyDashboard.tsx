const privacyItems = [
  { label: 'Ollama connection', value: 'Not connected' },
  { label: 'SQLite database', value: 'Not connected' },
  { label: 'File access', value: 'Disabled' },
  { label: 'Network sync', value: 'None' },
];

function PrivacyDashboard() {
  return (
    <section className="p-8">
      <p className="text-sm font-medium text-cyan-700">Privacy</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
        Privacy Dashboard
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Luna is local-first. Phase 1 shows planned privacy controls without enabling system actions.
      </p>

      <div className="mt-6 grid gap-3">
        {privacyItems.map((item) => (
          <article
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="font-medium text-slate-800">{item.label}</p>
            <span className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {item.value}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PrivacyDashboard;
