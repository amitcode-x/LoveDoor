// admin-panel/src/components/UI/Input.jsx
export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1 text-xs">
      {label && <label className="text-slate-300">{label}</label>}
      <input
        className={`w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500 ${className}`}
        {...props}
      />
      {error && (
        <div className="text-[11px] text-red-400 mt-0.5">{error}</div>
      )}
    </div>
  );
}
