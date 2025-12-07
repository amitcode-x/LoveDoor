import { useState } from "react";
import { createHeroSlide } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";

export default function HeroSlideCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    text: "",
    cta_text: "",
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
        fd.append(key, form[key]);
      });

      if (imageFile) fd.append("image", imageFile);

      await createHeroSlide(fd);
      setSuccess("Slide created successfully!");

      setTimeout(() => {
        navigate("/admin/homepage/hero-slides");
      }, 900);
    } catch (err) {
      console.error(err);
      setErr("Failed to create slide");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg text-slate-50 font-semibold">Add Hero Slide</h1>

      <Card>
        {err && <p className="text-[11px] text-red-400 mb-2">{err}</p>}
        {success && <p className="text-[11px] text-emerald-400 mb-2">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title" name="title" value={form.title} onChange={handleChange} />
          <Input label="Tagline" name="text" value={form.text} onChange={handleChange} />
          <Input label="Button Text" name="cta_text" value={form.cta_text} onChange={handleChange} />
          <Input label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />

          <div>
            <label className="text-xs text-slate-400">Upload Image</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs" />
          </div>

          <Input label="Sort Order" name="sort_order" value={form.sort_order} onChange={handleChange} />

          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            <span className="text-xs text-slate-300">Active</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
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
