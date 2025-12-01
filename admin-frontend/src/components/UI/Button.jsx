export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-xs font-medium px-3 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400 border border-emerald-500/60",
    outline:
      "border border-slate-700 text-slate-100 hover:bg-slate-800/80",
    ghost: "text-slate-300 hover:bg-slate-800/80",
    danger:
      "bg-red-500 text-white hover:bg-red-400 border border-red-500/60",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
