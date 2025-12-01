import { useEffect, useState } from "react";
import { getHomepageContent, updateHomepageContent } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function ManageHomepage() {
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getHomepageContent();
        setRaw(JSON.stringify(res.data, null, 2));
      } catch (error) {
        console.error(error);
        setErr(
          "Failed to load homepage content. Ensure /api/homepage/ returns JSON."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    setSuccess("");
    try {
      const parsed = JSON.parse(raw);
      const res = await updateHomepageContent(parsed);
      setRaw(JSON.stringify(res.data, null, 2));
      setSuccess("Homepage content updated successfully.");
    } catch (error) {
      console.error(error);
      setErr("Failed to update homepage content. Check JSON format.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">
          Manage Homepage
        </h1>
        <p className="text-xs text-slate-400">
          Edit homepage dynamic content (JSON-level control).
        </p>
      </div>

      <Card>
        {err && (
          <div className="text-[11px] text-red-400 mb-2">{err}</div>
        )}
        {success && (
          <div className="text-[11px] text-emerald-400 mb-2">{success}</div>
        )}

        <p className="text-[11px] text-slate-400 mb-2">
          Be careful while editing. Invalid JSON will break the homepage.
        </p>

        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={18}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-emerald-500"
        />

        <div className="mt-3 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
