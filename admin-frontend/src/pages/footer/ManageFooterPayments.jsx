import { useEffect, useState } from "react";
import {
  getFooterPayments,
  createFooterPayment,
  updateFooterPayment,
  deleteFooterPayment,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

export default function ManageFooterPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: null,
    name: "",
    image_file: null,
    image_url: "",
    sort_order: 0,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // LOAD PAYMENT METHODS
  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await getFooterPayments();
      setPayments(res.data);
    } catch (err) {
      console.error("Load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // INPUT HANDLER
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setForm((f) => ({
        ...f,
        image_file: files[0],
        image_url: "",
      }));
      return;
    }

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // EDIT PAYMENT METHOD
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      image_file: null,
      image_url: item.image_url || "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
  };

  // DELETE PAYMENT METHOD
  const handleDelete = async (id) => {
    if (form.id === id) {
      alert("⚠ You are editing this method, delete is blocked!");
      return;
    }

    if (!window.confirm("Delete this payment method?")) return;

    try {
      await deleteFooterPayment(id);
      setMessage("❌ Payment deleted!");
      resetForm();
      loadPayments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  // VALIDATION
  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!form.image_file && !form.image_url.trim()) {
      alert("Image or Image URL is required");
      return false;
    }

    return true;
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      image_file: null,
      image_url: "",
      sort_order: 0,
      is_active: true,
    });
  };

  // SUBMIT FORM (CREATE OR UPDATE)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("sort_order", form.sort_order);
    data.append("is_active", form.is_active);

    if (form.image_file) {
      data.append("image", form.image_file);
    } else if (form.image_url) {
      data.append("image_url", form.image_url);
    }

    try {
      if (form.id) {
        await updateFooterPayment(form.id, data);
        setMessage("✔ Payment Method Updated!");
      } else {
        await createFooterPayment(data);
        setMessage("✔ Payment Method Added!");
      }

      resetForm();
      loadPayments();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-50">
        Footer Payment Methods
      </h1>
      <p className="text-xs text-slate-400">
        Manage payment icons for your footer.
      </p>

      {message && (
        <div className="text-emerald-400 text-sm">{message}</div>
      )}

      {/* FORM */}
      <Card>
        <h2 className="text-sm font-semibold mb-3 text-slate-200">
          {form.id ? "Edit Payment Method" : "Add Payment Method"}
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Image URL"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            disabled={form.image_file !== null}
          />

          <Input
            label="Upload Image"
            name="image_file"
            type="file"
            onChange={handleChange}
            disabled={form.image_url.length > 0}
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

        {/* IMAGE PREVIEW */}
        {(form.image_file || form.image_url) && (
          <div className="mt-3">
            <p className="text-xs text-slate-400 mb-1">Preview:</p>
            <img
              src={
                form.image_file
                  ? URL.createObjectURL(form.image_file)
                  : form.image_url
              }
              alt="preview"
              className="h-12 bg-white p-2 rounded-md"
            />
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : form.id ? "Update" : "Add"}
          </Button>
        </div>
      </Card>

      {/* LIST */}
      <Card>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-slate-700">
                <th className="py-2 text-left">Icon</th>
                <th className="text-left">Name</th>
                <th>Active</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-800 text-slate-300"
                >
                  <td className="py-2">
                    <img
                      src={item.image}
                      alt=""
                      className="h-8 bg-white p-1 rounded"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.is_active ? "Yes" : "No"}</td>
                  <td>{item.sort_order}</td>
                  <td className="text-right space-x-2">
                    <Button variant="outline" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
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
