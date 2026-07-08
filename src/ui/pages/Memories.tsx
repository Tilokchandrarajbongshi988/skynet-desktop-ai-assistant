import { useEffect, useState } from 'react';

function Memories() {
  const [memories, setMemories] = useState<LunaMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadMemories() {
    const storedMemories = await window.luna.memory.getMemories();
    setMemories(storedMemories);
    setIsLoading(false);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  async function handleDelete(id: number) {
    await window.luna.memory.deleteMemory(id);
    await loadMemories();
  }

  async function handleClearAll() {
    const confirmed = window.confirm('Clear all memories? This cannot be undone.');

    if (!confirmed) {
      return;
    }

    await window.luna.memory.clearMemories();
    await loadMemories();
  }

  return (
    <section className="p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-700">Memory</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Memories</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Luna stores personal memories locally in SQLite and includes them in normal chat.
          </p>
        </div>

        <button
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={memories.length === 0}
          type="button"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {isLoading && <p className="text-sm text-slate-500">Loading memories...</p>}

        {!isLoading && memories.length === 0 && (
          <article className="rounded-lg border border-dashed border-slate-300 bg-white p-5">
            <p className="text-sm text-slate-600">
              No memories yet. In chat, type something like:
              <span className="ml-1 font-medium text-slate-950">
                remember that I prefer concise answers
              </span>
            </p>
          </article>
        )}

        {memories.map((memory) => (
          <article
            key={memory.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm text-slate-800">{memory.content}</p>
              <p className="mt-2 text-xs text-slate-400">
                {memory.category ?? 'preference'} · {new Date(memory.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              className="rounded-md px-3 py-1 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              type="button"
              onClick={() => handleDelete(memory.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Memories;
