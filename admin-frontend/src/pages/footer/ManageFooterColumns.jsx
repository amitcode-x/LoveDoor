// src/pages/footer/ManageFooterColumns.jsx
import { useEffect, useState } from "react";
import {
  getFooterColumns,
  createFooterColumn,
  updateFooterColumn,
  deleteFooterColumn,
  getFooterColumnLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ManageFooterColumns() {
  const [columns, setColumns] = useState([]);
  const [columnsLoading, setColumnsLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);

  const [selectedColumn, setSelectedColumn] = useState(null);

  const [columnForm, setColumnForm] = useState({
    id: null,
    title: "",
    slug: "",
    sort_order: 0,
    is_active: true,
  });

  const [columnSaving, setColumnSaving] = useState(false);

  const [links, setLinks] = useState([]);
  const [linkForm, setLinkForm] = useState({
    id: null,
    label: "",
    page_type: "",
    sort_order: 0,
    is_active: true,
    open_in_new_tab: false,
  });
  const [linkSaving, setLinkSaving] = useState(false);

  const [message, setMessage] = useState("");

  // ------------------ LOAD COLUMNS ------------------
  const loadColumns = async () => {
    setColumnsLoading(true);
    try {
      const res = await getFooterColumns();
      setColumns(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setColumnsLoading(false);
    }
  };

  // ------------------ LOAD LINKS OF COLUMN ------------------
  const loadLinks = async (column) => {
    if (!column) return;
    setLinksLoading(true);
    try {
      const res = await getFooterColumnLinks(column.id);
      setLinks(res.data || []);
    } catch (err) {
      console.error(err);
      setLinks([]);
    } finally {
      setLinksLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
  }, []);

  // when selectedColumn changes, load its links
  useEffect(() => {
    if (selectedColumn) {
      loadLinks(selectedColumn);
    } else {
      setLinks([]);
    }
  }, [selectedColumn]);

  // ------------------ COLUMN FORM HANDLERS ------------------
  const handleColumnChange = (e) => {
    const { name, value, type, checked } = e.target;
    let v = type === "checkbox" ? checked : value;

    setColumnForm((prev) => {
      const next = { ...prev, [name]: v };
      // auto slug from title if not editing existing slug
      if (name === "title" && !prev.id) {
        next.slug = slugify(v);
      }
      return next;
    });
  };

  const startCreateColumn = () => {
    setColumnForm({
      id: null,
      title: "",
      slug: "",
      sort_order: 0,
      is_active: true,
    });
    setSelectedColumn(null);
    setMessage("");
  };

  const startEditColumn = (col) => {
    setColumnForm({
      id: col.id,
      title: col.title || "",
      slug: col.slug || "",
      sort_order: col.sort_order || 0,
      is_active: col.is_active,
    });
    setSelectedColumn(col);
    setMessage("");
  };

  const handleSaveColumn = async () => {
    setMessage("");
    if (!columnForm.title.trim()) {
      setMessage("Column title is required.");
      return;
    }
    if (!columnForm.slug.trim()) {
      setMessage("Column slug is required.");
      return;
    }

    setColumnSaving(true);
    try {
      const payload = {
        title: columnForm.title.trim(),
        slug: columnForm.slug.trim(),
        sort_order: Number(columnForm.sort_order) || 0,
        is_active: !!columnForm.is_active,
      };

      if (columnForm.id) {
        await updateFooterColumn(columnForm.id, payload);
        setMessage("Column updated successfully.");
      } else {
        await createFooterColumn(payload);
        setMessage("Column created successfully.");
      }

      await loadColumns();

      // if editing, re-select updated column (by title/slug)
      if (columnForm.id) {
        const updated = columns.find((c) => c.id === columnForm.id);
        if (updated) setSelectedColumn(updated);
      } else {
        setColumnForm({
          id: null,
          title: "",
          slug: "",
          sort_order: 0,
          is_active: true,
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to save column.");
    } finally {
      setColumnSaving(false);
    }
  };

  const handleDeleteColumn = async (col) => {
    if (!col) return;

    if (columnSaving || linkSaving) {
      setMessage("Please wait, operation in progress.");
      return;
    }

    if (
      !window.confirm(
        `Delete column "${col.title}"? All its links will also be deleted.`
      )
    ) {
      return;
    }

    try {
      await deleteFooterColumn(col.id);
      setMessage("Column deleted.");
      // if same column selected, reset
      if (selectedColumn && selectedColumn.id === col.id) {
        setSelectedColumn(null);
        setLinks([]);
        setLinkForm({
          id: null,
          label: "",
          page_type: "",
          sort_order: 0,
          is_active: true,
          open_in_new_tab: false,
        });
      }
      await loadColumns();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete column.");
    }
  };

  // ------------------ LINK FORM HANDLERS ------------------
  const handleLinkChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLinkForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startCreateLink = () => {
    setLinkForm({
      id: null,
      label: "",
      page_type: "",
      sort_order: 0,
      is_active: true,
      open_in_new_tab: false,
    });
    setMessage("");
  };

  const startEditLink = (link) => {
    setLinkForm({
      id: link.id,
      label: link.label || "",
      page_type: link.page_type || "",
      sort_order: link.sort_order || 0,
      is_active: link.is_active,
      open_in_new_tab: link.open_in_new_tab,
    });
    setMessage("");
  };

  const handleSaveLink = async () => {
    setMessage("");
    if (!selectedColumn) {
      setMessage("Please select a column first.");
      return;
    }

    if (!linkForm.label.trim()) {
      setMessage("Link label is required.");
      return;
    }

    if (!linkForm.page_type.trim()) {
      setMessage("Please select a page type.");
      return;
    }

    setLinkSaving(true);
    try {
      const payload = {
        label: linkForm.label.trim(),
        page_type: linkForm.page_type,
        sort_order: Number(linkForm.sort_order) || 0,
        is_active: !!linkForm.is_active,
        open_in_new_tab: !!linkForm.open_in_new_tab,
        // url ko nahi bhejna bhi chalega (serializer optional + model auto)
      };

      if (linkForm.id) {
        await updateFooterLink(linkForm.id, payload);
        setMessage("Link updated successfully.");
      } else {
        await createFooterLink(selectedColumn.id, payload);
        setMessage("Link added successfully.");
      }

      await loadLinks(selectedColumn);
      startCreateLink();
    } catch (err) {
      console.error(err);
      setMessage("Failed to save link.");
    } finally {
      setLinkSaving(false);
    }
  };

  const handleDeleteLink = async (link) => {
    if (!link) return;

    if (linkSaving) {
      setMessage("Link is currently in process, please wait.");
      return;
    }

    if (!window.confirm(`Delete link "${link.label}"?`)) return;

    try {
      await deleteFooterLink(link.id);
      setMessage("Link deleted.");
      await loadLinks(selectedColumn);
      startCreateLink();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete link.");
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Footer Columns & Links
          </h1>
          <p className="text-xs text-slate-400">
            Manage footer columns and their inner links.
          </p>
        </div>
        <Button variant="outline" onClick={startCreateColumn}>
          + New Column
        </Button>
      </div>

      {message && (
        <p className="text-[11px] text-emerald-400">{message}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* ========== COLUMNS ========== */}
        <Card>
          <h2 className="text-sm font-semibold mb-3 text-slate-200">
            {columnForm.id ? "Edit Column" : "Add New Column"}
          </h2>

          <div className="space-y-3">
            <Input
              label="Title"
              name="title"
              value={columnForm.title}
              onChange={handleColumnChange}
              placeholder="Customer Service, Company..."
            />
            <Input
              label="Slug"
              name="slug"
              value={columnForm.slug}
              onChange={handleColumnChange}
              placeholder="customer-service"
            />
            <Input
              label="Sort Order"
              name="sort_order"
              type="number"
              value={columnForm.sort_order}
              onChange={handleColumnChange}
            />
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                name="is_active"
                checked={columnForm.is_active}
                onChange={handleColumnChange}
              />
              <span className="text-slate-300">Active</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {columnForm.id && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={startCreateColumn}
                >
                  Cancel
                </Button>
              )}
              <Button onClick={handleSaveColumn} disabled={columnSaving}>
                {columnSaving
                  ? "Saving..."
                  : columnForm.id
                  ? "Update Column"
                  : "Add Column"}
              </Button>
            </div>
          </div>

          <hr className="my-4 border-slate-800" />

          <h3 className="text-xs font-semibold text-slate-400 mb-2">
            Existing Columns
          </h3>

          {columnsLoading ? (
            <div className="py-3 text-xs text-slate-400">Loading...</div>
          ) : columns.length === 0 ? (
            <div className="py-3 text-xs text-slate-500">
              No columns yet. Add your first column above.
            </div>
          ) : (
            <div className="space-y-1 max-h-72 overflow-auto">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg border cursor-pointer ${
                    selectedColumn && selectedColumn.id === col.id
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-900/60 hover:bg-slate-900"
                  }`}
                  onClick={() => setSelectedColumn(col)}
                >
                  <div>
                    <div className="font-medium text-slate-100">
                      {col.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      slug: {col.slug} · order: {col.sort_order} ·{" "}
                      {col.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="xs"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditColumn(col);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteColumn(col);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ========== LINKS ========== */}
        <Card>
          <h2 className="text-sm font-semibold mb-3 text-slate-200">
            {selectedColumn
              ? `Links in: ${selectedColumn.title}`
              : "Select a column to manage links"}
          </h2>

          {!selectedColumn ? (
            <p className="text-xs text-slate-500">
              Click on a column from the left to view and manage its links.
            </p>
          ) : (
            <>
              {/* LINK FORM */}
              <div className="space-y-3 mb-4">
                <Input
                  label="Link Label"
                  name="label"
                  value={linkForm.label}
                  onChange={handleLinkChange}
                  placeholder="Track Order, Contact Us..."
                />

                <div className="space-y-1 text-xs">
                  <label className="text-slate-300">Page Type</label>
                  <select
                    name="page_type"
                    value={linkForm.page_type}
                    onChange={handleLinkChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="">Select page</option>
                    <option value="about">About Us</option>
                    <option value="contact">Contact Us</option>
                    <option value="privacy">Privacy Policy</option>
                    <option value="terms">Terms & Conditions</option>
                    <option value="shipping">Shipping Policy</option>
                    <option value="returns">Return & Refund Policy</option>
                    <option value="track-order">Track Order Page</option>
                    <option value="orders-returns">Orders & Return Page</option>
                    <option value="sitemap">Site Map Page</option>
                  </select>
                </div>

                <Input
                  label="Sort Order"
                  name="sort_order"
                  type="number"
                  value={linkForm.sort_order}
                  onChange={handleLinkChange}
                />

                <div className="flex items-center gap-4 text-xs">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={linkForm.is_active}
                      onChange={handleLinkChange}
                    />
                    <span className="text-slate-300">Active</span>
                  </label>

                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="open_in_new_tab"
                      checked={linkForm.open_in_new_tab}
                      onChange={handleLinkChange}
                    />
                    <span className="text-slate-300">Open in new tab</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {linkForm.id && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={startCreateLink}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleSaveLink} disabled={linkSaving}>
                    {linkSaving
                      ? "Saving..."
                      : linkForm.id
                      ? "Update Link"
                      : "Add Link"}
                  </Button>
                </div>
              </div>

              <hr className="my-3 border-slate-800" />

              <h3 className="text-xs font-semibold text-slate-400 mb-2">
                Existing Links
              </h3>

              {linksLoading ? (
                <div className="py-3 text-xs text-slate-400">Loading...</div>
              ) : links.length === 0 ? (
                <div className="py-3 text-xs text-slate-500">
                  No links for this column yet.
                </div>
              ) : (
                <div className="max-h-64 overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 text-left">Label</th>
                        <th className="text-left">Page</th>
                        <th className="text-left">URL</th>
                        <th>Order</th>
                        <th>Active</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => (
                        <tr
                          key={link.id}
                          className="border-b border-slate-900 text-slate-200"
                        >
                          <td className="py-2">{link.label}</td>
                          <td>{link.page_type}</td>
                          <td className="max-w-[180px] truncate text-[11px] text-slate-400">
                            {link.url}
                          </td>
                          <td className="text-center">
                            {link.sort_order ?? 0}
                          </td>
                          <td className="text-center">
                            {link.is_active ? "Yes" : "No"}
                          </td>
                          <td className="text-right space-x-1">
                            <Button
                              variant="outline"
                              size="xs"
                              type="button"
                              onClick={() => startEditLink(link)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="xs"
                              type="button"
                              onClick={() => handleDeleteLink(link)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
