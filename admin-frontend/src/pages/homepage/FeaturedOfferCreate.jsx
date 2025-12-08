import { useState } from "react";
import { createFeaturedOffer } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";

export default function FeaturedOfferCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    text: "",
    button_text: "Explore",
    image_url: "",
    sort_order: 0,
    is_active: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    setSuccess("");

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        // boolean fix
        if (key === "is_active") {
          fd.append("is_active", form.is_active ? "true" : "false");
        } else {
          fd.append(key, form[key]);
        }
      });

      if (imageFile) {
        fd.append("image", imageFile);
      }

      await createFeaturedOffer(fd);
      setSuccess("Featured offer created successfully.");
      // list pe wapas
      navigate("/homepage/featured-offers");
    } catch (err) {
      console.error(err);
      setErr("Failed to create featured offer.");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg text-slate-50 font-semibold">
          Add Featured Offer
        </h1>
      </div>

      <Card>
        {err && <p className="text-[11px] text-red-400 mb-2">{err}</p>}
        {success && (
          <p className="text-[11px] text-emerald-400 mb-2">{success}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <Input
            label="Short Text"
            name="text"
            value={form.text}
            onChange={handleChange}
          />

          <Input
            label="Button Text"
            name="button_text"
            value={form.button_text}
            onChange={handleChange}
          />

          <Input
            label="Image URL"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />

          {/* Image file */}
          <div>
            <label className="text-xs text-slate-400">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-xs text-slate-200 mt-1"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              If both Upload and URL are given, uploaded image will be used.
            </p>
          </div>

          <Input
            label="Sort Order"
            name="sort_order"
            value={form.sort_order}
            onChange={handleChange}
          />

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <span className="text-xs text-slate-300">Active</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/homepage/featured-offers")}
          >
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Input({ label, ...rest }) {
  return (
    <div>
      <label className="text-xs text-slate-400">{label}</label>
      <input
        {...rest}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
      />
    </div>
  );
}
