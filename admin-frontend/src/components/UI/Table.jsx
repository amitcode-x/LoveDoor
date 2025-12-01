// admin-panel/src/components/UI/Table.jsx
export function Table({ children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">{children}</table>
      </div>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
      {children}
    </thead>
  );
}

export function TBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }) {
  return (
    <tr className="border-b border-slate-800/80 hover:bg-slate-900/80">
      {children}
    </tr>
  );
}

export function Th({ children, align = "left" }) {
  return (
    <th
      className={`px-3 py-2 text-${align} font-medium whitespace-nowrap`}
    >
      {children}
    </th>
  );
}

export function Td({ children, align = "left", className = "" }) {
  return (
    <td
      className={`px-3 py-2 text-${align} whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );
}
