const privacyItems = [
  { label: 'AI processing', value: 'Local Ollama' },
  { label: 'Database', value: 'Local SQLite' },
  { label: 'Folder actions', value: 'Permission only' },
  { label: 'Cloud sync', value: 'Off' },
];

function PrivacyDashboard() {
  return (
    <section className="min-h-screen bg-white p-8">
      <p className="inline-block border border-black bg-yellow-300 px-3 py-1 text-sm font-semibold text-black">Privacy</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
        Privacy Dashboard
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
        Skynet keeps chat and approved action history on this computer.
      </p>

      <div className="mt-6 grid gap-3">
        {privacyItems.map((item) => (
          <article
            key={item.label}
            className="flex items-center justify-between rounded-md border border-black bg-white p-4"
          >
            <p className="font-semibold text-black">{item.label}</p>
            <span className="rounded-md border border-black bg-yellow-100 px-3 py-1 text-sm text-black">
              {item.value}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PrivacyDashboard;
