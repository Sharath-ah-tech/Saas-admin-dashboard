"use client";

import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { apiBaseUrl } from "../lib/admin-data";
import { PanelTitle, statusClass } from "./PanelTitle";

export type ResourceItem = { id: string | number } & Record<string, string | number | boolean | string[]>;

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "checkbox" | "textarea" | "array" | "select";
  options?: string[];
  placeholder?: string;
};

export type ColumnConfig = {
  key: string;
  label: string;
  badge?: boolean;
  secondaryKey?: string;
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
  initiallyOpen?: boolean;
};

export function ResourcePage({
  title,
  subtitle,
  endpoint,
  primaryAction,
  idPrefix,
  items: initialItems,
  fields,
  columns,
  initiallyOpen = false,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<ResourceItem | null>(initiallyOpen ? emptyItem(fields, idPrefix) : null);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formTitle = editing?.id && initialItems.some((item) => item.id === editing.id) ? `Edit ${title}` : primaryAction;
  const tableTemplate = useMemo(() => ({ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(140px, 1fr))` }), [columns.length]);

  // Client-side active search filter
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) =>
      Object.entries(item).some(([key, val]) => {
        if (key === "id" || typeof val === "string" || typeof val === "number") {
          return String(val).toLowerCase().includes(query);
        }
        if (Array.isArray(val)) {
          return val.some((v) => String(v).toLowerCase().includes(query));
        }
        return false;
      })
    );
  }, [items, searchQuery]);

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editing) {
      return;
    }

    setIsSaving(true);
    setStatus("");

    const exists = items.some((item) => item.id === editing.id);
    const url = exists ? `${apiBaseUrl}/${endpoint}/${editing.id}/` : `${apiBaseUrl}/${endpoint}/`;

    try {
      const response = await fetch(url, {
        method: exists ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const saved = (await response.json()) as ResourceItem;
      setItems((current) => (exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]));
      setEditing(null);
      setStatus("Saved to database. Dashboard data will refresh from the API.");
      router.refresh();
    } catch (error) {
      setStatus(`Could not save. Check that Django/MySQL is running. ${error instanceof Error ? error.message : ""}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItem(item: ResourceItem) {
    setStatus("");

    try {
      const response = await fetch(`${apiBaseUrl}/${endpoint}/${item.id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setStatus("Deleted from database.");
      router.refresh();
    } catch (error) {
      setStatus(`Could not delete. Check that Django/MySQL is running. ${error instanceof Error ? error.message : ""}`);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Admin module</p>
          <h1>{title}</h1>
        </div>
        <div className="topActions compactActions">
          <label className="searchBox" style={{ marginRight: "10px" }}>
            <Search size={16} aria-hidden />
            <input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                fontSize: "14px",
                outline: "none",
                width: "180px",
                paddingLeft: "5px",
              }}
            />
          </label>
          <button className="primaryButton" onClick={() => setEditing(emptyItem(fields, idPrefix))} type="button">
            <Plus size={17} aria-hidden />
            {primaryAction}
          </button>
        </div>
      </header>

      <section className="panel">
        <PanelTitle title={title} subtitle={subtitle} icon={<Check size={18} aria-hidden />} />
        {status ? <div className="notice">{status}</div> : null}
        <div className="dataTable resourceTable">
          <div className="tableRow tableHead" style={tableTemplate}>
            {columns.map((column) => (
              <span key={column.key}>{column.label}</span>
            ))}
            <span>Actions</span>
          </div>
          {filteredItems.map((item) => (
            <div className="tableRow" key={String(item.id)} style={tableTemplate}>
              {columns.map((column) => (
                <div key={column.key}>
                  {column.badge ? (
                    <mark className={statusClass(String(item[column.key] ?? ""))}>{String(item[column.key] ?? "")}</mark>
                  ) : (
                    <strong>{displayValue(item[column.key])}</strong>
                  )}
                  {column.secondaryKey ? <span>{displayValue(item[column.secondaryKey])}</span> : null}
                </div>
              ))}
              <div className="rowActions">
                <button onClick={() => setEditing(item)} type="button">
                  <Pencil size={15} aria-hidden />
                  Edit
                </button>
                <button onClick={() => deleteItem(item)} type="button">
                  <Trash2 size={15} aria-hidden />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
              No matching records found.
            </div>
          )}
        </div>
      </section>

      {editing ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-label={formTitle}>
          <form className="modalPanel" onSubmit={saveItem}>
            <div className="modalHeader">
              <div>
                <p className="eyebrow">Database action</p>
                <h2>{formTitle}</h2>
              </div>
              <button aria-label="Close form" onClick={() => setEditing(null)} type="button">
                <X size={18} aria-hidden />
              </button>
            </div>
            <div className="formGrid">
              {fields.map((field) => (
                <label className={field.type === "checkbox" ? "checkField" : ""} key={field.key}>
                  <span>{field.label}</span>
                  <FieldInput
                    field={field}
                    value={editing[field.key]}
                    onChange={(value) => setEditing((current) => (current ? { ...current, [field.key]: value } : current))}
                  />
                </label>
              ))}
            </div>
            <div className="modalActions">
              <button onClick={() => setEditing(null)} type="button">Cancel</button>
              <button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save to database"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: ResourceItem[string];
  onChange: (value: ResourceItem[string]) => void;
}) {
  if (field.type === "checkbox") {
    return <input checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} type="checkbox" />;
  }

  if (field.type === "select") {
    return (
      <select value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea" || field.type === "array") {
    return (
      <textarea
        placeholder={field.placeholder}
        value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
        onChange={(event) => onChange(field.type === "array" ? splitList(event.target.value) : event.target.value)}
      />
    );
  }

  return (
    <input
      placeholder={field.placeholder}
      type={field.type ?? "text"}
      value={String(value ?? "")}
      onChange={(event) => onChange(field.type === "number" ? Number(event.target.value) : event.target.value)}
    />
  );
}

function emptyItem(fields: FieldConfig[], idPrefix: string): ResourceItem {
  const item = fields.reduce<ResourceItem>(
    (item, field) => {
      if (field.type === "checkbox") {
        item[field.key] = false;
      } else if (field.type === "number") {
        item[field.key] = 0;
      } else if (field.type === "array") {
        item[field.key] = [];
      } else if (field.type === "select") {
        item[field.key] = field.options?.[0] ?? "";
      } else {
        item[field.key] = "";
      }

      return item;
    },
    { id: `${idPrefix}_${Date.now()}` },
  );

  if (!item.id) {
    item.id = `${idPrefix}_${Date.now()}`;
  }

  return item;
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function displayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value ?? "");
}
