// src/pages/homepage/ServiceFeatureCreate.jsx
import { useState } from "react";
import { createServiceFeature } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";

export default function ServiceFeatureCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    icon_key: "custom",
    title: "",
    description: "",
    link_text: "",
    link_type: "external",
    link_page: "",
    link_url: "",
    sort_order: "",
    is_active: true,
    image_url: "",
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    let temp = {};

    if (!form.title.trim()) temp.title = "Title is required";
    if (!form.description.trim()) temp.description = "Description is required";
    if (!form.link_text.trim()) temp.link_text = "Button text required";
    if (!form.sort_order) temp.sort_order = "Sort order required";

    if (form.link_type === "external") {
      if (!form.link_url.trim()) temp.link_url = "External URL required";
    } else {
      if (!form.link_page.trim()) temp.link_page = "Page selection required";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = async () => {
    if (!validate()) {
      window.scrollTo(0, 0);
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));

      if (imageFile) fd.append("image", imageFile);

      await createServiceFeature(fd);
      navigate("/admin/homepage/service-features");
    } catch (error) {
      console.error(error);
      alert("Failed to create feature");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-50">Add Service Feature</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Select label="Icon Key" name="icon_key" value={form.icon_key} onChange={handleChange}
            options={[
              ["money_back", "Money Back"],
              ["shipping", "Fast Shipping"],
              ["support", "24/7 Support"],
              ["custom", "Custom"],
            ]}
          />

          <Input label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} />

          <Input label="Description" name="description" value={form.description} onChange={handleChange} error={errors.description} />

          <Input label="Button Text" name="link_text" value={form.link_text} onChange={handleChange} error={errors.link_text} />

          <Select label="Link Type" name="link_type" value={form.link_type} onChange={handleChange}
            options={[
              ["cms", "CMS Page"],
              ["system", "System Page"],
              ["shop", "Shop Page"],
              ["external", "External URL"],
            ]}
          />

          {form.link_type !== "external" && (
            <Select
              label="Select Page"
              name="link_page"
              value={form.link_page}
              onChange={handleChange}
              error={errors.link_page}
              options={[
                ["CMS:about", "CMS → About Us"],
                ["CMS:contact", "CMS → Contact Us"],
                ["CMS:privacy", "CMS → Privacy Policy"],
                ["SYS:cart", "System → Cart"],
                ["SYS:wishlist", "System → Wishlist"],
                ["SHOP:shop", "Shop → Shop Page"],
                ["SHOP:all-products", "Shop → All Products"],
              ]}
            />
          )}

          {form.link_type === "external" && (
            <Input label="External Link URL" name="link_url" value={form.link_url} onChange={handleChange} error={errors.link_url} />
          )}

          <Input label="Image URL (optional)" name="image_url" value={form.image_url} onChange={handleChange} />

          <div>
            <label className="text-xs text-slate-400">Upload Image (optional)</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-slate-200" />
          </div>

          <Input label="Sort Order" name="sort_order" value={form.sort_order} onChange={handleChange} error={errors.sort_order} />

          <div className="flex items-center gap-3 pt-4">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            <span className="text-xs text-slate-300">Active</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>{saving ? "Saving..." : "Create Feature"}</Button>
        </div>
      </Card>
    </div>
  );
}

function Input({ label, error, ...rest }) {
  return (
    <div>
      <label className="text-xs text-slate-400">{label}</label>
      <input
        {...rest}
        className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs ${
          error ? "border-red-500" : "border-slate-800 text-slate-200"
        }`}
      />
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, options, error, ...rest }) {
  return (
    <div>
      <label className="text-xs text-slate-400">{label}</label>
      <select
        {...rest}
        className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs ${
          error ? "border-red-500" : "border-slate-800 text-slate-200"
        }`}
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
