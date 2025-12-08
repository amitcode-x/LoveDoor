import { useEffect, useState } from "react";
import { getGiftOffer, updateGiftOffer } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function GiftOfferEdit() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    button_text: "",
    button_link: "",
    image_url: "",
    is_active: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* -------------------------
      LOAD DATA
  -------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await getGiftOffer();
        setForm(res.data);
        setExistingImage(res.data.final_image || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load gift offer data.");
      }
      setLoading(false);
    }
    load();
  }, []);

  /* -------------------------
      HANDLE INPUT
  -------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------------------------
      SAVE DATA
  -------------------------- */
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "button_link") return;

        if (key === "is_active") {
          fd.append("is_active", form.is_active ? "true" : "false");
        } else {
          fd.append(key, form[key] ?? "");
        }
      });

      if (imageFile) fd.append("image", imageFile);

      const res = await updateGiftOffer(fd);
      setSuccess("Gift Offer updated successfully!");
      setForm(res.data);
      setExistingImage(res.data.final_image);
    } catch (err) {
      console.error(err);
      setError("Failed to update Gift Offer.");
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
      <h1 className="text-lg font-semibold text-slate-50">Gift Offer Section</h1>
      <p className="text-xs text-slate-400">
        Manage homepage gift highlight section.
      </p>

      <Card>
        {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}
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
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <Input
            label="Button Text"
            name="button_text"
            value={form.button_text}
            onChange={handleChange}
          />

          {/* Button Link */}
          <div>
            <label className="text-xs text-slate-400">Button Link</label>
            <input
              type="text"
              readOnly
              value={form.button_link}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Image URL */}
          <Input
            label="Image URL"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />

          {/* Upload Image */}
          <div>
            <label className="text-xs text-slate-400">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-200"
            />

            {existingImage && (
              <img
                src={existingImage}
                alt=""
                className="mt-2 w-32 h-20 rounded object-cover border border-slate-700"
              />
            )}
          </div>

          {/* Active Toggle */}
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
