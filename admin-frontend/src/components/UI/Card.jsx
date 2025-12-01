// admin-panel/src/components/UI/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-3 sm:p-4 ${className}`}
    >
      {children}
    </div>
  );
}
