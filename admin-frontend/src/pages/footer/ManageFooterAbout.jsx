import { useEffect, useState } from "react";
import {
  getFooterAboutPage,
  updateFooterAboutPage,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageFooterAbout() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ===================== LOAD DATA =====================
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await getFooterAboutPage();
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load About page settings.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ===================== CHANGE HANDLER =====================
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm((f) => ({
    ...f,
    [name]: type === "checkbox"
      ? Boolean(checked)
      : value === "true"
      ? true
      : value === "false"
      ? false
      : value
  }));
};


  // ===================== SAVE =====================
const handleSave = async () => {
  setSaving(true);
  setMsg("");
  setError("");

  try {
    let cleanForm = { ...form };

    // ❌ Do NOT send ID
    delete cleanForm.id;

    // ❌ Do NOT send cta_link (because editable=False)
    delete cleanForm.cta_link;

    // If empty → convert to null (backend DEFAULT apply karega)
 // Important: NEVER send null for CharFields
Object.keys(cleanForm).forEach((key) => {
  if (cleanForm[key] === "" || cleanForm[key] === null) {
    cleanForm[key] = ""; // always empty string
  }
});



    await updateFooterAboutPage(cleanForm);

    // Load latest with defaults applied
    const res = await getFooterAboutPage();
    setForm(res.data);

    setMsg("Saved successfully!");
  } catch (err) {
    console.error(err);
    setError("Failed to save changes.");
  }

  setSaving(false);
};



  // ===================== LOADING UI =====================
  if (loading || !form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            About Page Settings
          </h1>
          <p className="text-xs text-slate-400">
            Control the content shown on the public About Us page.
          </p>
        </div>
      </div>

      {(error || msg) && (
        <Card>
          {error && <p className="text-[11px] text-red-400 mb-1">{error}</p>}
          {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
        </Card>
      )}

      <Card className="space-y-6">
        {/* HERO SECTION */}
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Page Title"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            required
          />
          <div className="space-y-1 text-xs md:col-span-2">
            <label className="text-slate-300">Intro Text</label>
            <textarea
              name="intro_text"
              value={form.intro_text || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Mission Title"
            name="mission_title"
            value={form.mission_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Mission Description</label>
            <textarea
              name="mission_description"
              value={form.mission_description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>

          <Input
            label="Vision Title"
            name="vision_title"
            value={form.vision_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Vision Description</label>
            <textarea
              name="vision_description"
              value={form.vision_description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
        </div>

        {/* STATS SECTION */}
        <div>
          <h2 className="text-xs font-semibold text-slate-300 mb-2">
            Stats Section (4 Cards)
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            <Input label="Stat 1 Label" name="stat_1_label" value={form.stat_1_label || ""} onChange={handleChange} />
            <Input label="Stat 1 Value" name="stat_1_value" value={form.stat_1_value || ""} onChange={handleChange} />
            <Input label="Stat 2 Label" name="stat_2_label" value={form.stat_2_label || ""} onChange={handleChange} />
            <Input label="Stat 2 Value" name="stat_2_value" value={form.stat_2_value || ""} onChange={handleChange} />

            <Input label="Stat 3 Label" name="stat_3_label" value={form.stat_3_label || ""} onChange={handleChange} />
            <Input label="Stat 3 Value" name="stat_3_value" value={form.stat_3_value || ""} onChange={handleChange} />
            <Input label="Stat 4 Label" name="stat_4_label" value={form.stat_4_label || ""} onChange={handleChange} />
            <Input label="Stat 4 Value" name="stat_4_value" value={form.stat_4_value || ""} onChange={handleChange} />
          </div>
        </div>

        {/* WHO WE ARE + WHY CHOOSE US */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Who We Are</label>
            <textarea
              name="who_we_are"
              value={form.who_we_are || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Why Choose Us (each line = one bullet)</label>
            <textarea
              name="why_choose_us"
              value={form.why_choose_us || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
        </div>

        {/* CTA + STATUS */}
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="CTA Button Text"
            name="cta_text"
            value={form.cta_text || ""}
            onChange={handleChange}
          />

          <div className="space-y-1 text-xs">
            <label className="text-slate-300">CTA Link (fixed)</label>
            <input
              value={form.cta_link || "/shop"}
              disabled
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs mt-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active ?? true}
              onChange={handleChange}
            />
            <span className="text-slate-300">Set as active About page</span>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
