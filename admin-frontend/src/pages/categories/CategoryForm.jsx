// src/pages/categories/CategoryForm.jsx
import { useEffect, useState } from "react";
import {
  createCategory,
  getCategoryDetail,
  updateCategory,
} from "../../api/adminApi";
import { useNavigate, useParams } from "react-router-dom";

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
    banner_image: "",
    category_image_url: "",
    category_image: null,
    category_icon: null,
  });

  const [slug, setSlug] = useState("");

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  useEffect(() => {
    if (isEdit) loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCategory = async () => {
    const res = await getCategoryDetail(id);
    setForm({
      name: res.data.name,
      description: res.data.description,
      is_active: res.data.is_active,
      banner_image: res.data.banner_image || "",
      category_image_url: res.data.category_image_url || "",
      category_image: null,
      category_icon: null,
    });
    setSlug(res.data.slug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) fd.append(key, val);
    });

    try {
      if (isEdit) {
        await updateCategory(id, fd);
        alert("Category updated");
      } else {
        await createCategory(fd);
        alert("Category created");
      }
      navigate("/categories");
    } catch {
      alert("Save failed");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              {isEdit ? "Edit Category" : "Create Category"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Define category details, media and visibility for your catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="text-[11px] md:text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-900/80 transition"
          >
            Back to list
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.9)] p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/70 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    Basic Information
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Name, slug and description for this category.
                  </p>
                </div>

                {slug && (
                  <code className="hidden md:inline-flex rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[11px] text-slate-300">
                    slug: {slug}
                  </code>
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
                    placeholder="e.g. Electronics, Clothing"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    This will be visible on the storefront.
                  </p>
                </div>

                {/* SLUG READONLY */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Slug (auto)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    readOnly
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-400"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Generated automatically. Used for links and routing.
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                  rows={3}
                  placeholder="Short description of this category..."
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Optional. Shown on category landing pages.
                </p>
              </div>

              {/* ACTIVE */}
              <div className="flex items-center gap-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      handleChange("is_active", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-medium text-slate-200">
                    Active
                  </span>
                </label>
                <span className="text-[11px] text-slate-500">
                  Inactive categories won&apos;t be visible to customers.
                </span>
              </div>
            </div>

            {/* Media */}
            <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/70 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    Media & Icons
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Configure banner, category image and icon.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* BANNER IMAGE URL */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Banner Image URL
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    placeholder="https://example.com/banner.jpg"
                    value={form.banner_image}
                    onChange={(e) =>
                      handleChange("banner_image", e.target.value)
                    }
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Optional. Large banner used on top of category pages.
                  </p>

                  {form.banner_image && (
                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/80 p-2">
                      <p className="text-[10px] text-slate-500 mb-1">
                        Banner preview
                      </p>
                      <div className="h-20 w-full overflow-hidden rounded-lg bg-slate-900">
                        <img
                          src={form.banner_image}
                          alt="Banner Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* CATEGORY IMAGE URL */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Category Image URL
                    </label>
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                      placeholder="https://example.com/category.jpg"
                      value={form.category_image_url}
                      onChange={(e) =>
                        handleChange("category_image_url", e.target.value)
                      }
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Used when no uploaded image is provided.
                    </p>
                  </div>

                  {/* CATEGORY IMAGE UPLOAD */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Category Image (upload)
                    </label>
                    <input
                      type="file"
                      className="block w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                      onChange={(e) =>
                        handleChange("category_image", e.target.files[0])
                      }
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Upload a square image (recommended).
                    </p>
                  </div>
                </div>
              </div>

              {/* CATEGORY ICON */}
              <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category Icon (upload)
                  </label>
                  <input
                    type="file"
                    className="block w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                    onChange={(e) =>
                      handleChange("category_icon", e.target.files[0])
                    }
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Small icon displayed in compact views or menus.
                  </p>
                </div>

                {/* Combined preview (URL based only, because uploads are in memory) */}
                <div className="border border-slate-800 rounded-xl bg-slate-950/80 p-3">
                  <p className="text-[10px] text-slate-500 mb-2">
                    Category card preview (using URLs)
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden flex items-center justify-center">
                      {form.category_image_url ? (
                        <img
                          src={form.category_image_url}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[9px] text-slate-600">
                          No image
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-100">
                        {form.name || "Category name"}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 max-w-[200px]">
                        {form.description || "Category description preview"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="text-[11px] md:text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-900/80 transition"
              >
                Cancel
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-900 text-xs md:text-sm px-5 py-2.5 font-medium shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition">
                Save Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
