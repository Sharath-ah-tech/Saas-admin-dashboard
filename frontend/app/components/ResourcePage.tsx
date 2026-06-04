"use client";

import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createResource, deleteResource, updateResource } from "../lib/admin-data";
import { PanelTitle, statusClass } from "./PanelTitle";

export type ResourceItem = Record<string, unknown>;

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "select" | "boolean" | "number";
  options?: string[];
  readOnly?: boolean;
};

export type ColumnConfig = {
  key: string;
  label: string;
  render?: (value: unknown, row: ResourceItem) => React.ReactNode;
};

type Props = {
  title: string;
  subtitle: string;
  endpoint: string;
  primaryAction: string;
  idPrefix: string;
  items: ResourceItem[];
  fields: FieldConfig[];
  columns: ColumnConfig[];
  icon?: React.ReactNode;
};

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ResourcePage({
  title,
  subtitle,
  endpoint,
  primaryAction,
  idPrefix,
  items: initialItems,
  fields,
  columns,
  icon,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState<ResourceItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [formData, setFormData] = useState<ResourceItem>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [items, search]);

  function startCreate() {
    const defaults: ResourceItem = { id: generateId(idPrefix) };
    fields.forEach((f) => {
      if (f.key !== "id") defaults[f.key] = f.type === "boolean" ? false : "";
    });
    setFormData(defaults);
    setCreatingNew(true);
    setEditingId(null);
    setError("");
  }

  function startEdit(item: ResourceItem) {
    setFormData({ ...item });
    setEditingId(item.id as string);
    setCreatingNew(false);
    setError("");
  }

  function cancelForm() {
    setEditingId(null);
    setCreatingNew(false);
    setFormData({});
    setError("");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (creatingNew) {
        const created = await createResource(endpoint, formData);
        setItems((prev) => [created as ResourceItem, ...prev]);
      } else if (editingId) {
        const updated = await updateResource(endpoint, editingId, formData);
        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? (updated as ResourceItem) : item))
        );
      }
      cancelForm();
      router.refresh();
    } catch (err) {
      setError(
        `Could not save. Check that Django is running. ${err instanceof Error ? err.message : ""}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    setSaving(true);
    setError("");
    try {
      await deleteResource(endpoint, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (err) {
      setError(
        `Could not delete. Check that Django is running. ${err instanceof Error ? err.message : ""}`
      );
    } finally {
      setSaving(false);
    }
  }

  function handleField(key: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  const isFormOpen = creatingNew || editingId !== null;

  return (
    <div className="resourcePage">
      {/* Header */}
      <header className="topbar">
        <div>
          <p className="eyebrow">{title}</p>
          <h1>{subtitle}</h1>
        </div>
        <button className="primaryBtn" onClick={startCreate} type="button">
          <Plus size={16} aria-hidden /> {primaryAction}
        </button>
      </header>

      {/* Error banner */}
      {error && (
        <div className="noticeBanner error">
          {error}
          <button onClick={() => setError("")} type="button"><X size={14} /></button>
        </div>
      )}

      {/* Inline form (create / edit) */}
      {isFormOpen && (
        <form className="panel inlineForm" onSubmit={handleSave}>
          <div className="inlineFormHeader">
            <strong>{creatingNew ? `New ${title.toLowerCase().replace(/s$/, "")}` : "Edit record"}</strong>
            <button type="button" onClick={cancelForm} className="iconBtn">
              <X size={16} />
            </button>
          </div>
          <div className="inlineFormFields">
            {fields.map((field) => (
              <label key={field.key} className="formField">
                <span>{field.label}</span>
                {field.readOnly ? (
                  <input value={String(formData[field.key] ?? "")} readOnly className="readOnly" />
                ) : field.type === "select" && field.options ? (
                  <select
                    value={String(formData[field.key] ?? "")}
                    onChange={(e) => handleField(field.key, e.target.value)}
                  >
                    <option value="">— select —</option>
                    {field.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : field.type === "boolean" ? (
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={Boolean(formData[field.key])}
                      onChange={(e) => handleField(field.key, e.target.checked)}
                    />
                    <span>{Boolean(formData[field.key]) ? "Yes" : "No"}</span>
                  </label>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={String(formData[field.key] ?? "")}
                    onChange={(e) => handleField(field.key, e.target.value)}
                    placeholder={field.label}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="inlineFormActions">
            <button type="submit" className="primaryBtn" disabled={saving}>
              <Check size={15} /> {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" className="secondaryBtn" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="panel tablePanel">
        <div className="tableToolbar">
          <div className="searchBox">
            <Search size={15} aria-hidden />
            <input
              placeholder={`Search ${title.toLowerCase()}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="tableCount">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                {columns.map((col) => <th key={col.key}>{col.label}</th>)}
                <th className="actionsCol">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="emptyRow">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id as string} className={editingId === item.id ? "editingRow" : ""}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render
                          ? col.render(item[col.key], item)
                          : col.key === "status"
                          ? <span className={statusClass(String(item[col.key] ?? ""))}>{String(item[col.key] ?? "")}</span>
                          : String(item[col.key] ?? "—")}
                      </td>
                    ))}
                    <td className="actionsCol">
                      <button
                        className="iconBtn"
                        title="Edit"
                        onClick={() => startEdit(item)}
                        type="button"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="iconBtn danger"
                        title="Delete"
                        onClick={() => handleDelete(item.id as string)}
                        type="button"
                        disabled={saving}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}