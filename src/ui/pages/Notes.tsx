const notes = [
  { title: 'Project goal', body: 'Luna should run locally and keep user data private.' },
  { title: 'Next milestone', body: 'Connect fake chat UI to Ollama after Phase 1.' },
];

function Notes() {
  return (
    <section className="p-8">
      <p className="text-sm font-medium text-cyan-700">Notes</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Notes</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Notes are static for now. The create note action and SQLite persistence come later.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <article key={note.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-950">{note.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{note.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Notes;
