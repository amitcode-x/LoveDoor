import { useEffect, useState } from "react";
import { getTermsOfUse, updateTermsOfUse } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageTermsOfUse() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ============= LOAD DATA =============
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await getTermsOfUse();
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Terms of Use settings.");
      }
      setLoading(false);
    }
    load();
  }, []);

  // ============= CHANGE HANDLER =============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  // ============= SAVE =============
  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    setError("");

    try {
      let cleanForm = { ...form };
      delete cleanForm.id;

      // ❌ yaha blank ko null NAHI bana rahe
      // defaults backend serializer me handle honge

      await updateTermsOfUse(cleanForm);

      const res = await getTermsOfUse();
      setForm(res.data);

      setMsg("Saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save.");
    }

    setSaving(false);
  };

  // ============= LOADING UI =============
  if (loading || !form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  // ============= MAIN UI =============
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-slate-50">
          Terms of Use Page Settings
        </h1>
        <p className="text-xs text-slate-400">
          Manage Terms & Conditions content shown on the website.
        </p>
      </div>

      {(error || msg) && (
        <Card>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        </Card>
      )}

      <Card className="space-y-6">
        {/* TITLE + INTRO */}
        <Input
          label="Page Title"
          name="title"
          value={form.title || ""}
          onChange={handleChange}
        />

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

        {/* SECTION 1 */}
        <div className="space-y-2">
          <Input
            label="Section 1 Title"
            name="section1_title"
            value={form.section1_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Section 1 Content</label>
            <textarea
              name="section1_content"
              rows={3}
              value={form.section1_content || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-2">
          <Input
            label="Section 2 Title"
            name="section2_title"
            value={form.section2_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Section 2 Content</label>
            <textarea
              name="section2_content"
              rows={3}
              value={form.section2_content || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="space-y-2">
          <Input
            label="Section 3 Title"
            name="section3_title"
            value={form.section3_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Section 3 Content</label>
            <textarea
              name="section3_content"
              rows={3}
              value={form.section3_content || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="space-y-2">
          <Input
            label="Section 4 Title"
            name="section4_title"
            value={form.section4_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Section 4 Content</label>
            <textarea
              name="section4_content"
              rows={3}
              value={form.section4_content || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* SECTION 5 */}
        <div className="space-y-2">
          <Input
            label="Section 5 Title"
            name="section5_title"
            value={form.section5_title || ""}
            onChange={handleChange}
          />
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Section 5 Content</label>
            <textarea
              name="section5_content"
              rows={3}
              value={form.section5_content || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* FOOTER NOTE + ACTIVE */}
        <Input
          label="Footer Note (e.g. Last updated text)"
          name="footer_note"
          value={form.footer_note || ""}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2 mt-2 text-xs">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active ?? true}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: e.target.checked }))
            }
          />
          <span className="text-slate-300">Set Terms of Use page as active</span>
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
