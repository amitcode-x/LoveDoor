import { useEffect, useState } from "react";
import { getStaticHero, updateStaticHero } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function StaticHeroEdit() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    button_text: "",
    button_link: "",
    image_url: "",
    is_active: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* -------------------------
      LOAD STATIC HERO DATA
  -------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await getStaticHero();
        setForm({
          ...res.data,
          subtitle: res.data.subtitle || "",
          image_url: res.data.image_url || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load Static Hero data.");
      }
      setLoading(false);
    }
    load();
  }, []);

  /* -------------------------
       HANDLE INPUT CHANGE
  -------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------------------------
        SAVE STATIC HERO
  -------------------------- */
  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const formData = new FormData();

      // Required safe fields
      formData.append("title", form.title || "");
      formData.append("subtitle", form.subtitle || "");
      formData.append("button_text", form.button_text || "");
      formData.append("image_url", form.image_url || "");
      formData.append("is_active", form.is_active ? "true" : "false");

      // Only add image if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await updateStaticHero(formData);

      setSuccess("Static Hero updated successfully!");
      setForm(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update Static Hero.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-50">
        Static Hero Section
      </h1>
      <p className="text-xs text-slate-400">
        Manage homepage main banner content.
      </p>

      <Card>
        {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}
        {success && (
          <p className="text-[11px] text-emerald-400 mb-2">{success}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="text-xs text-slate-400">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-xs text-slate-400">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="text-xs text-slate-400">Button Text</label>
            <input
              type="text"
              name="button_text"
              value={form.button_text}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Button Link */}
          <div>
            <label className="text-xs text-slate-400">Button Link</label>
            <input
              type="text"
              readOnly
              value={form.button_link}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              *This link is fixed in backend.
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs text-slate-400">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs text-slate-400">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-200"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <span className="text-xs text-slate-300">Active</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
