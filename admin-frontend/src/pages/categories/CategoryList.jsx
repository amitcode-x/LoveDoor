// src/pages/categories/CategoryList.jsx
import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../api/adminApi";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.results || res.data); // pagination safe
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadData();
    } catch {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-40 rounded-lg bg-slate-800/70" />
            <div className="h-9 w-28 rounded-xl bg-slate-800/70" />
          </div>
          <div className="h-10 w-full rounded-2xl bg-slate-900/70" />
          <div className="h-40 w-full rounded-2xl bg-slate-900/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
            Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage product categories, images and visibility for your storefront.
          </p>
        </div>

        <Link
          to="/categories/create"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-900 text-xs md:text-sm px-4 py-2 font-medium shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/10">
            +
          </span>
          <span>Add Category</span>
        </Link>
      </div>

      {/* Overview strip */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs text-slate-300">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Total categories:
          <span className="font-semibold text-slate-50">
            {categories.length}
          </span>
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800">
          Active:{" "}
          <span className="font-semibold text-emerald-400">
            {categories.filter((c) => c.is_active).length}
          </span>
        </span>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.9)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/70 bg-slate-950/80">
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            Category List
          </span>
          <span className="text-[11px] text-slate-400">
            Showing{" "}
            <span className="text-slate-50 font-medium">
              {categories.length}
            </span>{" "}
            entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  Category
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left font-medium">
                  Slug
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
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500 text-xs"
                  >
                    No categories found. Create your first category to get
                    started.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-900/70 transition-colors"
                  >
                    {/* Image + Name */}
                    <td className="px-3 md:px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden flex items-center justify-center">
                          {cat.category_image_url || cat.category_image ? (
                            <img
                              src={cat.category_image_url || cat.category_image}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              No image
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-50 font-medium text-xs md:text-sm">
                            {cat.name}
                          </span>
                          {cat.description && (
                            <span className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {cat.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-3 md:px-4 py-3 text-slate-400">
                      <code className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[11px] border border-slate-800">
                        {cat.slug}
                      </code>
                    </td>

                    {/* Status */}
                    <td className="px-3 md:px-4 py-3">
                      {cat.is_active ? (
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

                    {/* Actions */}
                    <td className="px-3 md:px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/categories/${cat.id}`}
                          className="text-[11px] md:text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id)}
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
