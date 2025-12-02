import { useEffect, useState } from "react";
import { getReturnRefund, updateReturnRefund } from "../../api/adminApi";


import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageReturnRefund() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await getReturnRefund();
      setForm(res.data);
    } catch (err) {
      setError("Failed to load");
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

 const handleSave = async () => {
  setSaving(true);
  setMsg("");
  setError("");

  // ❌ TITLE MUST NOT BE EMPTY
  if (!form.title || form.title.trim() === "") {
    setError("⚠️ Title cannot be empty.");
    setSaving(false);
    return;
  }

  try {
    let clean = { ...form };
    delete clean.id;

    await updateReturnRefund(clean);

    const res = await getReturnRefund();
    setForm(res.data);

    setMsg("Saved successfully!");
  } catch (err) {
    console.error(err);
    setError("Failed to save.");
  }

  setSaving(false);
};


  if (!form || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <h1 className="text-lg font-semibold text-slate-50">Return & Refund Policy</h1>
      <p className="text-xs text-slate-400">Manage refund/returns content</p>

      {(msg || error) && (
        <Card>
          {msg ? <p className="text-emerald-400 text-xs">{msg}</p> : <p className="text-red-400 text-xs">{error}</p>}
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

        {[1, 2, 3].map((i) => (
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

        <Input label="Footer Note" name="footer_note" value={form.footer_note || ""} onChange={handleChange} />

        <div className="flex justify-end">
          <Button onClick={handleSave}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>

      </Card>
    </div>
  );
}
