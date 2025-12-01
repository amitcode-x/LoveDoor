import { useEffect, useState } from "react";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageSocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: null,
    platform: "facebook",
    url: "",
    sort_order: 0,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await getSocialLinks();
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      platform: item.platform,
      url: item.url,
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
  };

  // -------------------------------
  // DELETE BLOCK IN EDIT MODE
  // -------------------------------
  const handleDelete = async (id) => {
    // If editing something → block delete of ANY item
    if (form.id !== null) {
      showMsg("Finish editing before deleting any link!");
      return;
    }

    if (!window.confirm("Delete this social link?")) return;

    try {
      await deleteSocialLink(id);
      showMsg("Link deleted successfully!");
      loadLinks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validateForm = () => {
    if (!form.platform || !form.url.trim()) {
      showMsg("Please fill all required fields!");
      return false;
    }

    try {
      new URL(form.url);
    } catch {
      showMsg("Invalid URL format!");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setForm({
      id: null,
      platform: "facebook",
      url: "",
      sort_order: 0,
      is_active: true,
    });
  };

  // -------------------------------
  // ADD / UPDATE SUBMIT
  // -------------------------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      platform: form.platform,
      url: form.url.trim(),
      sort_order: Number(form.sort_order),
      is_active: form.is_active,
    };

    try {
      // If ID exists → update
      if (form.id) {
        await updateSocialLink(form.id, payload);
        showMsg("Social link updated!");
      } else {
        // Create new link
        await createSocialLink(payload);
        showMsg("Social link added!");
      }

      resetForm();
      loadLinks();
    } catch (err) {
      console.error(err);

      // If item was deleted in background
      if (err?.response?.status === 404) {
        showMsg("This link no longer exists. Resetting form...");
        resetForm();
      } else {
        alert("Failed to save.");
      }
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-50">Social Links</h1>
      <p className="text-xs text-slate-400">Manage your footer social links.</p>

      {msg && (
        <p className="text-xs text-emerald-400 bg-emerald-900/20 p-2 rounded">
          {msg}
        </p>
      )}

      {/* ---------------- FORM ---------------- */}
      <Card>
        <h2 className="text-sm font-semibold mb-3 text-slate-200">
          {form.id ? "Edit Social Link" : "Add New Social Link"}
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            name="platform"
            value={form.platform}
            onChange={handleChange}
            className="bg-slate-800 text-slate-200 text-sm p-2 rounded"
          >
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter / X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="other">Other</option>
          </select>

          <Input
            label="URL *"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://facebook.com/yourpage"
            required
          />

          <Input
            label="Sort Order"
            name="sort_order"
            type="number"
            value={form.sort_order}
            onChange={handleChange}
          />

          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <label className="text-slate-300">Active</label>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : form.id ? "Update" : "Add Link"}
          </Button>
        </div>
      </Card>

      {/* ---------------- LIST ---------------- */}
      <Card>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-slate-700">
                <th className="py-2 text-left">Platform</th>
                <th className="text-left">URL</th>
                <th>Active</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 text-slate-300">
                  <td className="py-2">{item.platform}</td>
                  <td>{item.url}</td>
                  <td>{item.is_active ? "Yes" : "No"}</td>
                  <td>{item.sort_order}</td>
                  <td className="text-right space-x-2">

                    <Button variant="outline" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                      disabled={form.id !== null} // disable during Edit mode
                    >
                      Delete
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
