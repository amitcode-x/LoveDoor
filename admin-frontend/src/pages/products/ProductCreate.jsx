import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCategories,
  createProduct,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ProductCreate() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    discount_price: "",
    stock: "",
    thumbnail: "",
    short_description: "",
    description: "",
    is_active: true,
    is_featured: false,
    is_new: false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // ---------------------------
  // Load category list
  // ---------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await getCategories();   // returns array
        setCategories(res.data);
      } catch (err) {
        console.error("Category load failed", err);
      }
    }
    load();
  }, []);

  // ---------------------------
  // Handle input
  // ---------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        category_id: form.category_id,
        price: form.price,
        discount_price: form.discount_price || null,
        stock: form.stock,
        thumbnail: form.thumbnail,
        short_description: form.short_description,
        description: form.description,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_new: form.is_new,
      };

      await createProduct(payload);

      navigate("/products");
    } catch (error) {
      console.error(error);
      setError("Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Create Product
          </h1>
          <p className="text-xs text-slate-400">
            Add a new product to your store.
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
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Category */}
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

          {/* Price */}
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />

          {/* Discount Price */}
          <Input
            label="Discount Price"
            name="discount_price"
            type="number"
            step="0.01"
            value={form.discount_price}
            onChange={handleChange}
          />

          {/* Stock */}
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

          {/* Short Description */}
          <div className="md:col-span-2">
            <Input
              label="Short Description"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
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

          {/* Checkboxes */}
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

          {/* Error */}
          {error && (
            <div className="md:col-span-2 text-[11px] text-red-400">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
