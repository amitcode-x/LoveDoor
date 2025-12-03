import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCategories,
  getProductDetail,
  updateProduct,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // Load product + categories
  // ------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(), // category list
          getProductDetail(id), // product detail
        ]);

        setCategories(catRes.data.results || []);

        const p = prodRes.data;

        setForm({
          name: p.name || "",
          category_id: p.category?.id || "",
          price: p.price || "",
          discount_price: p.discount_price || "",
          stock: p.stock || "",
          thumbnail: p.thumbnail || "",
          short_description: p.short_description || "",
          description: p.description || "",
          // ⭐ FIXED BOOLEAN FIELDS
          is_active: p.is_active ?? false,
          is_featured: p.is_featured ?? false,
          is_new: p.is_new ?? false,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // ------------------------------------
  // Handle input change
  // ------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ------------------------------------
  // Submit update
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        price: form.price,
        discount_price: form.discount_price || null,
        stock: form.stock,
        thumbnail: form.thumbnail,
        short_description: form.short_description,
        description: form.description,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_new: form.is_new,
        category_id: form.category_id,
      };

      await updateProduct(id, payload);
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------
  // Loading Spinner
  // ------------------------------------
  if (loading || !form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Edit Product</h1>
          <p className="text-xs text-slate-400">
            Update product details and status.
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* CATEGORY */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />

          {/* DISCOUNT PRICE */}
          <Input
            label="Discount Price"
            name="discount_price"
            type="number"
            step="0.01"
            value={form.discount_price || ""}
            onChange={handleChange}
          />

          {/* STOCK */}
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
          />

          {/* Thumbnail URL */}
          <Input
            label="Thumbnail URL"
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            required
          />

          {/* SHORT DESCRIPTION */}
          <div className="md:col-span-2">
            <Input
              label="Short Description"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2 space-y-1 text-xs">
            <label className="text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
            />
          </div>

          {/* CHECKBOXES */}
          <div className="flex items-center gap-2 text-xs mt-2">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <label htmlFor="is_active" className="text-slate-300">
              Active
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs mt-2">
            <input
              id="is_featured"
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
            />
            <label htmlFor="is_featured" className="text-slate-300">
              Featured
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs mt-2">
            <input
              id="is_new"
              type="checkbox"
              name="is_new"
              checked={form.is_new}
              onChange={handleChange}
            />
            <label htmlFor="is_new" className="text-slate-300">
              Mark as NEW
            </label>
          </div>

          {/* ERROR */}
          {error && (
            <div className="md:col-span-2 text-[11px] text-red-400">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
