type PermissionModalProps = {
  action: LunaAction;
  onAllow: () => void;
  onCancel: () => void;
};

function PermissionModal({ action, onAllow, onCancel }: PermissionModalProps) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/60 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <p className="text-sm font-medium text-cyan-700">Permission required</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950">
          {getActionTitle(action)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {getActionDescription(action)}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            type="button"
            onClick={onAllow}
          >
            Allow
          </button>
        </div>
      </section>
    </div>
  );
}

function getActionTitle(action: LunaAction) {
  if (action.type === 'CREATE_NOTE') {
    return 'Create a local note';
  }

  if (action.type === 'OPEN_APP') {
    return `Open ${action.payload.appName}`;
  }

  return 'Search file names';
}

function getActionDescription(action: LunaAction) {
  if (action.type === 'CREATE_NOTE') {
    return `Luna will create a .txt note named "${action.payload.title}" in your local Luna Notes folder.`;
  }

  if (action.type === 'OPEN_APP') {
    return `Luna will try to open the approved app "${action.payload.appName}".`;
  }

  return `Luna will ask you to choose one folder, then search only file names in that folder for "${action.payload.query}".`;
}

export default PermissionModal;
