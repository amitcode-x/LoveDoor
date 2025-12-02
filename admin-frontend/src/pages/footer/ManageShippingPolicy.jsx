import { useEffect, useState } from "react";
import { getShippingPolicy, updateShippingPolicy } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageShippingPolicy() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await getShippingPolicy();
      setForm(res.data);
    } catch (e) {
      setError("Failed to load");
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const applyDefaults = () => {
    // Forces backend to reapply defaults
    Object.keys(form).forEach((key) => {
      if (typeof form[key] === "string") {
        form[key] = ""; // empty means → default in backend
      }
    });
    setForm({ ...form });
  };

const handleSave = async () => {
  setSaving(true);
  setMsg("");
  setError("");

  try {
    let clean = { ...form };
    delete clean.id;

    await updateShippingPolicy(clean);

    const res = await getShippingPolicy();
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
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Shipping Policy</h1>
          <p className="text-xs text-slate-400">Manage website shipping rules</p>
        </div>

        <Button onClick={applyDefaults}>Apply Defaults</Button>
      </div>

      {(msg || error) && (
        <Card>
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </Card>
      )}

      <Card className="space-y-6">

        <Input label="Title" name="title" value={form.title || ""} onChange={handleChange} />

        <textarea
          name="intro_text"
          rows={3}
          value={form.intro_text || ""}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-100"
        />

        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <Input
              label={`Section ${i} Title`}
              name={`section${i}_title`}
              value={form[`section${i}_title`] || ""}
              onChange={handleChange}
            />
            <textarea
              rows={3}
              name={`section${i}_content`}
              value={form[`section${i}_content`] || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-100"
            />
          </div>
        ))}

        <Input
          label="Footer Note"
          name="footer_note"
          value={form.footer_note || ""}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
