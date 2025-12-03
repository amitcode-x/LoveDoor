// src/pages/categories/BottomNavForm.jsx
import { useEffect, useState } from "react";
import {
  createBottomNavCategory,
  getBottomNavCategoryDetail,
  updateBottomNavCategory,
} from "../../api/adminApi";
import { useNavigate, useParams } from "react-router-dom";

export default function BottomNavForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon_name: "",
    order: 1,
    is_active: true,
    type: "custom",
    created_at: "",
  });

  const [fallbackList, setFallbackList] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await getBottomNavCategoryDetail(id);
      setForm(res.data);
      setFallbackList(res.data.default_preview_list || []);
    } catch {
      alert("Failed to load");
    }
  };

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateBottomNavCategory(id, form);
        alert("Updated!");
      } else {
        await createBottomNavCategory(form);
        alert("Created!");
      }

      navigate("/bottom-nav");
    } catch (err) {
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              {isEdit ? "Edit Bottom Nav Category" : "Create Bottom Nav Category"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure how this category appears in your bottom navigation bar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/bottom-nav")}
            className="text-[11px] md:text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-900/80 transition"
          >
            Back to list
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.9)] p-4 md:p-6">
          <form onSubmit={save} className="space-y-5">
            {/* Basic Info */}
            <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/60 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    Basic Information
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Name, slug and icon used in the bottom nav bar.
                  </p>
                </div>

                {form.type && (
                  <span className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                    Type: {form.type}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NAME */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    placeholder="e.g. Home, Shop, Profile"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    This label will be visible to users in the bottom nav.
                  </p>
                </div>

                {/* SLUG (readonly) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400"
                    value={form.slug}
                    readOnly
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Generated identifier used internally for routing.
                  </p>
                </div>
              </div>

              {/* ICON & ORDER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ICON */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    placeholder="e.g. home, shopping-bag"
                    value={form.icon_name}
                    onChange={(e) =>
                      setForm({ ...form, icon_name: e.target.value })
                    }
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Match this with the icon set you are using on the frontend.
                  </p>
                </div>

                {/* ORDER */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Order
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Controls the position of this item in the bottom nav.
                  </p>
                </div>
              </div>
            </div>

            {/* Status & Meta */}
            <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/60 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    Status & Meta
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Control visibility and see creation metadata.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* ACTIVE TOGGLE */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-emerald-500"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                    />
                    <span className="text-xs font-medium text-slate-200">
                      Active
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    When disabled, this item won&apos;t appear in the app UI.
                  </span>
                </div>

                {/* CREATED AT */}
                {isEdit && (
                  <div className="text-right md:text-left md:ml-auto">
                    <p className="text-[11px] text-slate-500 mb-1">
                      Created At
                    </p>
                    <input
                      className="w-full md:w-56 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-400"
                      value={
                        form.created_at
                          ? new Date(form.created_at).toLocaleString()
                          : ""
                      }
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>

            {/* DEFAULT LIST PREVIEW */}
            {fallbackList.length > 0 && (
              <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/60">
                <h2 className="text-sm font-semibold text-slate-100 mb-2">
                  Default Categories Preview
                </h2>
                <p className="text-[11px] text-slate-400 mb-2">
                  These categories will be used as a fallback / preview list.
                </p>
                <div className="flex flex-wrap gap-2">
                  {fallbackList.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[11px] text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/bottom-nav")}
                className="text-[11px] md:text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-900/80 transition"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-900 text-xs md:text-sm px-5 py-2.5 font-medium shadow-md shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
