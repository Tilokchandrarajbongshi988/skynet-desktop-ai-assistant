type PermissionModalProps = {
  action: SkynetAction;
  onAllow: () => void;
  onCancel: () => void;
};

function PermissionModal({ action, onAllow, onCancel }: PermissionModalProps) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-black/50 p-6">
      <section className="w-full max-w-md rounded-md border border-black bg-white p-6">
        <p className="inline-block border border-black bg-yellow-300 px-3 py-1 text-sm font-semibold text-black">
          Permission required
        </p>
        <h2 className="mt-4 text-lg font-semibold text-black">
          {getActionTitle(action)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">
          {getActionDescription(action)}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-black bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-100"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md border border-black bg-yellow-300 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-200"
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

function getActionTitle(action: SkynetAction) {
  if (action.type === 'CREATE_NOTE') {
    return 'Create a local note';
  }

  if (action.type === 'OPEN_APP') {
    return `Open ${action.payload.appName}`;
  }

  if (action.type === 'OPEN_FOLDER') {
    return `Open ${action.folderName}`;
  }

  return 'Search file names';
}

function getActionDescription(action: SkynetAction) {
  if (action.type === 'CREATE_NOTE') {
    return `Skynet will create a .txt note named "${action.payload.title}" in your local Skynet Notes folder.`;
  }

  if (action.type === 'OPEN_APP') {
    return `Skynet will try to open the approved app "${action.payload.appName}".`;
  }

  if (action.type === 'OPEN_FOLDER') {
    return `Skynet will open your ${action.folderName} folder using Windows Explorer.`;
  }

  return `Skynet will ask you to choose one folder, then search only file names in that folder for "${action.payload.query}".`;
}

export default PermissionModal;
