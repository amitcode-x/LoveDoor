import { useEffect, useState } from "react";
import { getContactPage, updateContactPage } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageContactPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ================================
  // LOAD DATA
  // ================================
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await getContactPage();
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load contact page settings.");
      }

      setLoading(false);
    }
    load();
  }, []);

  // ================================
  // INPUT HANDLER
  // ================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================================
  // SAVE CHANGES
  // ================================
  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    setError("");

    try {
      let cleanForm = { ...form };

      // Never send ID
      delete cleanForm.id;

      // Blank => null
      Object.keys(cleanForm).forEach((key) => {
        if (cleanForm[key] === "") cleanForm[key] = null;
      });

      await updateContactPage(cleanForm);

      const refreshed = await getContactPage();
      setForm(refreshed.data);

      setMsg("Saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save.");
    }

    setSaving(false);
  };

  // ================================
  // LOADING UI
  // ================================
  if (loading || !form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  // ================================
  // MAIN UI
  // ================================
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-slate-50">Contact Page Settings</h1>
        <p className="text-xs text-slate-400">Manage contact details shown on website</p>
      </div>

      {(error || msg) && (
        <Card>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        </Card>
      )}

      <Card className="space-y-6">

        {/* TITLE */}
        <Input
          label="Page Title"
          name="title"
          value={form.title || ""}
          onChange={handleChange}
        />

        {/* INTRO */}
        <div className="space-y-1 text-xs">
          <label className="text-slate-300">Intro Text</label>
          <textarea
            name="intro_text"
            rows={3}
            value={form.intro_text || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
          />
        </div>

        {/* CONTACT DETAILS */}
        <Input
          label="Phone Number"
          name="phone_number"
          value={form.phone_number || ""}
          onChange={handleChange}
        />

        <Input
          label="Email Address"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
        />

        <Input
          label="Office Address"
          name="address"
          value={form.address || ""}
          onChange={handleChange}
        />

        <Input
          label="Working Hours"
          name="working_hours"
          value={form.working_hours || ""}
          onChange={handleChange}
        />

        {/* MAP URL */}
        <div className="space-y-1 text-xs">
          <label className="text-slate-300">Google Map Embed URL</label>
          <textarea
            name="map_embed_url"
            rows={2}
            value={form.map_embed_url || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
          />
        </div>

        {/* ACTIVE STATUS */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active ?? true}
            onChange={handleChange}
          />
          <span className="text-slate-300">Set Contact Page as Active</span>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

      </Card>
    </div>
  );
}
