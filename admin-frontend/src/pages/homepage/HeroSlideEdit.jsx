import { useEffect, useState } from "react";
import { getHeroSlideDetail, updateHeroSlide } from "../../api/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function HeroSlideEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    text: "",
    cta_text: "",
    image_url: "",
    sort_order: 0,
    is_active: true,
  });

  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getHeroSlideDetail(id);
        setForm(res.data);
        setExistingImage(res.data.image);
      } catch (err) {
        console.error(err);
        setError("Failed to load slide");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 
const handleSave = async () => {
  console.log("UPDATE SENDING DATA ===>", form);

  setSaving(true);
  setError("");

  try {
    const fd = new FormData();

    // --- SAFE FIELDS ---
    if (form.title) fd.append("title", form.title);
    fd.append("text", form.text || "");
    fd.append("cta_text", form.cta_text || "");
    fd.append("sort_order", form.sort_order ?? 0);

    // boolean fix
    fd.append("is_active", form.is_active ? "true" : "false");

    // image_url only IF not empty
    if (form.image_url && form.image_url.trim() !== "") {
      fd.append("image_url", form.image_url);
    }

    // new image upload
    if (imageFile) {
      fd.append("image", imageFile);
    }

    // ---- NEVER SEND THESE ----
    // fd.append("id", ...)
    // fd.append("cta_link", ...)
    // fd.append("image", null)
    // fd.append("image_url", "")  // removed

    const res = await updateHeroSlide(id, fd);

    navigate("/admin/homepage/hero-slides");
  } catch (err) {
    console.error(err);
    setError("Unable to update slide");
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
      <h1 className="text-lg font-semibold text-slate-50">Edit Slide</h1>

      <Card>
        {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}
        {success && <p className="text-[11px] text-emerald-400 mb-2">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title" name="title" value={form.title} onChange={handleChange} />
          <Input label="Tagline / Text" name="text" value={form.text} onChange={handleChange} />
          <Input label="Button Text" name="cta_text" value={form.cta_text} onChange={handleChange} />
          <Input label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />

          <div>
            <label className="text-xs text-slate-400">Replace Image</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs" />

            {existingImage && (
              <img
                src={existingImage}
                alt="current"
                className="mt-2 w-32 h-20 rounded object-cover border border-slate-700"
              />
            )}
          </div>

          <Input label="Sort Order" name="sort_order" value={form.sort_order} onChange={handleChange} />

          <div className="flex items-center gap-3 pt-4">
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
