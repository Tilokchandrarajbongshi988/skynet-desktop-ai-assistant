export type PageId = 'onboarding' | 'chat' | 'privacy' | 'settings';

type SidebarProps = {
  activePage: PageId;
  setupComplete: boolean;
  onNavigate: (page: PageId) => void;
};

const links: Array<{ id: PageId; label: string; marker: string }> = [
  { id: 'chat', label: 'Chat', marker: 'C' },
  { id: 'privacy', label: 'Privacy', marker: 'P' },
  { id: 'settings', label: 'Settings', marker: 'S' },
];

function Sidebar({ activePage, setupComplete, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-black bg-white px-4 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-md border border-black bg-yellow-300 font-semibold text-black">
          S
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-black">Skynet</h1>
          <p className="text-xs text-zinc-600">Local AI assistant</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {!setupComplete && (
          <button
            className="mb-2 flex items-center gap-3 rounded-md border border-black bg-yellow-300 px-3 py-2 text-left text-sm font-semibold text-black"
            type="button"
            onClick={() => onNavigate('onboarding')}
          >
            <span className="grid h-6 w-6 place-items-center rounded border border-black bg-white text-xs font-bold text-black">
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
                  ? 'border border-black bg-yellow-300 font-semibold text-black'
                  : 'border border-transparent text-zinc-700 hover:border-black hover:bg-yellow-100 hover:text-black',
              ].join(' ')}
              type="button"
              onClick={() => onNavigate(link.id)}
            >
              <span
                className={[
                  'grid h-6 w-6 place-items-center rounded text-xs font-semibold',
                  isActive ? 'border border-black bg-white text-black' : 'border border-black bg-white text-black',
                ].join(' ')}
              >
                {link.marker}
              </span>
              {link.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-md border border-black bg-yellow-50 p-3">
        <p className="text-xs font-semibold text-black">Privacy mode</p>
        <p className="mt-1 text-xs leading-5 text-zinc-700">
          Chats and approved actions stay local on this computer.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
