const memories = [
  'Prefers privacy-first local tools',
  'Building Luna as a desktop AI assistant',
  'Wants beginner-friendly architecture',
];

function Memories() {
  return (
    <section className="p-8">
      <p className="text-sm font-medium text-cyan-700">Memory</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Memories</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Static examples for Phase 1. Later this page reads from the SQLite memory model.
      </p>

      <div className="mt-6 grid gap-3">
        {memories.map((memory) => (
          <article key={memory} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-700">{memory}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Memories;
