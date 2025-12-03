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
    <div className="p-4 max-w-xl">
      <h1 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Category" : "Create Category"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAME */}
        <div>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            className="w-full border p-2 mt-1"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* SLUG READONLY */}
        <div>
          <label className="font-semibold">Slug (auto)</label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full border p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            className="w-full border p-2 mt-1"
            rows="3"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* ACTIVE */}
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
          />
          <label className="font-semibold">Active</label>
        </div>

        {/* BANNER IMAGE URL */}
        <div>
          <label className="font-semibold">Banner Image URL</label>
          <input
            className="w-full border p-2 mt-1"
            value={form.banner_image}
            onChange={(e) => handleChange("banner_image", e.target.value)}
          />
        </div>

        {/* CATEGORY IMAGE UPLOAD */}
        <div>
          <label className="font-semibold">Category Image (upload)</label>
          <input
            type="file"
            className="mt-1"
            onChange={(e) => handleChange("category_image", e.target.files[0])}
          />
        </div>

        {/* CATEGORY IMAGE URL */}
        <div>
          <label className="font-semibold">Category Image URL</label>
          <input
            className="w-full border p-2 mt-1"
            value={form.category_image_url}
            onChange={(e) => handleChange("category_image_url", e.target.value)}
          />
        </div>

        {/* CATEGORY ICON */}
        <div>
          <label className="font-semibold">Category Icon</label>
          <input
            type="file"
            className="mt-1"
            onChange={(e) => handleChange("category_icon", e.target.files[0])}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Category
        </button>
      </form>
    </div>
  );
}
