// admin-panel/src/components/UI/Modal.jsx
export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
          <button
            className="text-xs text-slate-400 hover:text-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="text-xs text-slate-100 space-y-2">{children}</div>
      </div>
    </div>
  );
}
