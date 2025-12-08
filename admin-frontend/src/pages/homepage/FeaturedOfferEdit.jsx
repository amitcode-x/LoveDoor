import { useEffect, useState } from "react";
import {
  getFeaturedOfferDetail,
  updateFeaturedOffer,
} from "../../api/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function FeaturedOfferEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    text: "",
    button_text: "",
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

  // LOAD
  useEffect(() => {
    async function load() {
      try {
        const res = await getFeaturedOfferDetail(id);
        setForm({
          title: res.data.title || "",
          text: res.data.text || "",
          button_text: res.data.button_text || "",
          image_url: res.data.image_url || "",
          sort_order: res.data.sort_order ?? 0,
          is_active: res.data.is_active ?? true,
        });
        setExistingImage(res.data.image || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load featured offer.");
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
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();

      // id / button_link backend read-only hain, isliye nahi bhejenge
      Object.keys(form).forEach((key) => {
        if (key === "button_link" || key === "id") return;

        if (key === "is_active") {
          fd.append("is_active", form.is_active ? "true" : "false");
        } else {
          fd.append(key, form[key] ?? "");
        }
      });

      if (imageFile) {
        fd.append("image", imageFile);
      }

      await updateFeaturedOffer(id, fd);
      setSuccess("Featured offer updated successfully.");
      navigate("/homepage/featured-offers");
    } catch (err) {
      console.error(err);
      setError("Unable to update featured offer.");
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
        Edit Featured Offer
      </h1>

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

          {/* Upload Image */}
          <div>
            <label className="text-xs text-slate-400">Replace Image</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-xs text-slate-200 mt-1"
            />

            {existingImage && (
              <img
                src={existingImage}
                alt="current"
                className="mt-2 w-32 h-20 rounded object-cover border border-slate-700"
              />
            )}
          </div>

          <Input
            label="Sort Order"
            name="sort_order"
            value={form.sort_order}
            onChange={handleChange}
          />

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

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/homepage/featured-offers")}
          >
            Cancel
          </Button>

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
