import { useEffect, useState } from "react";
import { getNewsletterSettings, updateNewsletterSettings } from "../../api/adminApi";
// import { getNewsletterSettings, updateNewsletterSettings } from "../../api/adminApi";


import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageNewsletter() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    placeholder: "",
    button_text: "",
    is_enabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getNewsletterSettings();
        setForm(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateNewsletterSettings(form);
      setMsg("Saved successfully!");
    } catch (err) {
      setMsg("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="text-center text-slate-300">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-50">Newsletter Settings</h1>
      <p className="text-xs text-slate-400">Configure the footer newsletter section.</p>

      <Card className="space-y-4">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} />
        <Input label="Description" name="description" value={form.description} onChange={handleChange} />
        <Input label="Placeholder" name="placeholder" value={form.placeholder} onChange={handleChange} />
        <Input label="Button Text" name="button_text" value={form.button_text} onChange={handleChange} />

        <div className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="is_enabled" checked={form.is_enabled} onChange={handleChange} />
          <label className="text-slate-300">Enable Newsletter</label>
        </div>

        {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Card>
    </div>
  );
}
