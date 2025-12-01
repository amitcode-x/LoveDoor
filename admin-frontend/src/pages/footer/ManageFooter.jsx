import { useEffect, useState } from "react";
import { getFooterBrand, updateFooterBrand } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageFooter() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getFooterBrand();
        setForm(res.data);
      } catch (err) {
        setError("Failed to load footer brand information.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateFooterBrand(form);

      alert("Brand Information Updated Successfully!");
    } catch (err) {
      setError("Failed to update brand information");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-50">Footer Brand Settings</h1>
      <p className="text-xs text-slate-400">
        Edit your brand name, tagline, and footer text.
      </p>

      {error && (
        <Card>
          <p className="text-xs text-red-400">{error}</p>
        </Card>
      )}

      {form && (
        <Card>
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Site Name" name="site_name" value={form.site_name || ""} onChange={handleChange} />
            <Input label="Tagline" name="tagline" value={form.tagline || ""} onChange={handleChange} />
            <Input label="Description" name="description" value={form.description || ""} onChange={handleChange} className="md:col-span-2" />
            <Input label="Copyright Text" name="copyright_text" value={form.copyright_text || ""} onChange={handleChange} />
            <Input label="Owner Text" name="owner_text" value={form.owner_text || ""} onChange={handleChange} />
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}