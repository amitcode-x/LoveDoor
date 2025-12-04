// src/pages/categories/BottomNavList.jsx
import { useEffect, useState } from "react";
import {
  getBottomNavCategories,
  deleteBottomNavCategory,
} from "../../api/adminApi";
import { Link } from "react-router-dom";

export default function BottomNavList() {
  const [items, setItems] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getBottomNavCategories();
      // console.log("BOTTOM NAV DATA →", res.data);

      // 🔴 res.data = { count, next, previous, results: [] }
      const data = res.data;
      const list = Array.isArray(data) ? data : data.results || [];
      setItems(list);
    } catch (e) {
      console.error("Error loading bottom nav", e);
      setErr("Failed to load bottom navigation categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bottom nav item?")) return;

    try {
      await deleteBottomNavCategory(id);
      await load();
      alert("Deleted successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to delete.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-800/60" />
          <div className="h-10 w-full rounded-xl bg-slate-900/60" />
          <div className="h-40 w-full rounded-xl bg-slate-900/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-50 flex items-center gap-2">
            Bottom Navigation Categories
            {items.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {items.length} items
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage the categories that appear in your app’s bottom navigation.
          </p>
        </div>

        <Link
          to="/bottom-nav/create"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-900 text-xs md:text-sm px-4 py-2 font-medium shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/10">
            +
          </span>
          <span>Add Bottom Nav Item</span>
        </Link>
      </div>

      {err && (
        <div className="text-xs text-red-300 bg-red-950/50 border border-red-800/70 rounded-xl px-3 py-2 flex items-start gap-2">
          <span className="mt-[2px] text-red-400">!</span>
          <span>{err}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 shadow-[0_18px_40px_rgba(15,23,42,0.9)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/70 bg-slate-950/60">
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            Category Overview
          </span>
          <span className="text-[11px] text-slate-400">
            Active:{" "}
            <span className="text-emerald-400 font-medium">
              {items.filter((i) => i.is_active).length}
            </span>{" "}
            / {items.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  #
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  Name
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  Slug
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  Icon
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  Status
                </th>
                <th className="px-3 md:px-4 py-2.5 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500 text-xs"
                  >
                    No bottom nav categories found.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/70 transition-colors"
                  >
                    <td className="px-3 md:px-4 py-2.5 text-slate-400 text-[11px] md:text-xs">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-[10px] text-slate-300">
                          {item.order ?? index + 1}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-slate-50 font-medium text-xs md:text-sm">
                          {item.name}
                        </span>
                        {item.type && (
                          <span className="mt-0.5 inline-flex w-fit rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                            {item.type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2.5 text-slate-400">
                      <code className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[11px] border border-slate-800">
                        {item.slug}
                      </code>
                    </td>
                    <td className="px-3 md:px-4 py-2.5 text-slate-300">
                      {item.icon_name ? (
                        <span className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[11px] text-slate-200">
                          {item.icon_name}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-3 md:px-4 py-2.5">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 text-[11px] border border-red-500/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-4 py-2.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/bottom-nav/${item.id}`}
                          className="text-[11px] md:text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-[11px] md:text-xs text-red-400 hover:text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
