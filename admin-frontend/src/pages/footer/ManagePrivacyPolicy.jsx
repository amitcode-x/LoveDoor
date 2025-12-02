import { useEffect, useState } from "react";
import { getPrivacyPolicy, updatePrivacyPolicy } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManagePrivacyPolicy() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getPrivacyPolicy();
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load page.");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    setError("");

    try {
      let cleanForm = { ...form };
      delete cleanForm.id;

      // blank → null → backend will apply defaults
      Object.keys(cleanForm).forEach((key) => {
        
      });

      await updatePrivacyPolicy(cleanForm);

      const res = await getPrivacyPolicy();
      setForm(res.data);

      setMsg("Saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save.");
    }

    setSaving(false);
  };

  if (loading || !form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-50">Privacy Policy</h1>

      {(msg || error) && (
        <Card>
          {msg && <p className="text-emerald-400 text-xs">{msg}</p>}
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </Card>
      )}

      <Card className="space-y-6">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} />

        <div className="space-y-1 text-xs">
          <label className="text-slate-300">Intro Text</label>
          <textarea
            name="intro_text"
            value={form.intro_text}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
          />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Input
              label={`Section ${i + 1} Title`}
              name={`section${i + 1}_title`}
              value={form[`section${i + 1}_title`] || ""}
              onChange={handleChange}
            />

            <textarea
              name={`section${i + 1}_content`}
              value={form[`section${i + 1}_content`] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 px-3 py-2 text-xs text-slate-100"
            />
          </div>
        ))}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Card>
    </div>
  );
}
