type PermissionModalProps = {
  title: string;
  description: string;
  onClose: () => void;
};

function PermissionModal({ title, description, onClose }: PermissionModalProps) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/60 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <button
          className="mt-6 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          type="button"
          onClick={onClose}
        >
          Got it
        </button>
      </section>
    </div>
  );
}

export default PermissionModal;
