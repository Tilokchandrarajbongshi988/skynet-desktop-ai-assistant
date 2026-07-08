export type PageId = 'onboarding' | 'chat' | 'memories' | 'notes' | 'privacy' | 'settings';

type SidebarProps = {
  activePage: PageId;
  setupComplete: boolean;
  onNavigate: (page: PageId) => void;
};

const links: Array<{ id: PageId; label: string; marker: string }> = [
  { id: 'chat', label: 'Chat', marker: 'C' },
  { id: 'memories', label: 'Memories', marker: 'M' },
  { id: 'notes', label: 'Notes', marker: 'N' },
  { id: 'privacy', label: 'Privacy', marker: 'P' },
  { id: 'settings', label: 'Settings', marker: 'S' },
];

function Sidebar({ activePage, setupComplete, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400 font-semibold text-slate-950">
          L
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Luna</h1>
          <p className="text-xs text-slate-400">Local AI assistant</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {!setupComplete && (
          <button
            className="mb-2 flex items-center gap-3 rounded-md bg-slate-900 px-3 py-2 text-left text-sm font-medium text-cyan-200"
            type="button"
            onClick={() => onNavigate('onboarding')}
          >
            <span className="grid h-6 w-6 place-items-center rounded bg-cyan-400 text-xs font-bold text-slate-950">
              O
            </span>
            Onboarding
          </button>
        )}

        {links.map((link) => {
          const isActive = activePage === link.id;

          return (
            <button
              key={link.id}
              className={[
                'flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white',
              ].join(' ')}
              type="button"
              onClick={() => onNavigate(link.id)}
            >
              <span
                className={[
                  'grid h-6 w-6 place-items-center rounded text-xs font-semibold',
                  isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-400',
                ].join(' ')}
              >
                {link.marker}
              </span>
              {link.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
        <p className="text-xs font-medium text-slate-300">Privacy mode</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Phase 1 uses local fake data. Ollama and SQLite connect later.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
