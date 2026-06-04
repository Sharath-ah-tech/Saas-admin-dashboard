import type { AdminDashboardData } from "../types";

// In local dev, Next.js proxies /api/* → Django (see next.config.js)
// In production (Vercel), NEXT_PUBLIC_API_URL points to the Render backend
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined"
    ? "http://localhost:8000/api"   // SSR fallback
    : "/api");                      // CSR fallback

// ─── Generic fetch helpers ───────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${apiBaseUrl}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch<void>(path, { method: "DELETE" });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  try {
    return await apiGet<AdminDashboardData>("/dashboard/summary/");
  } catch {
    return fallbackAdminData;
  }
}

export async function getResource<T>(
  endpoint: string,
  fallback: T[]
): Promise<T[]> {
  try {
    const data = await apiGet<T[] | { results: T[] }>(`/${endpoint}/`);
    // DRF paginated response
    if (data && typeof data === "object" && "results" in data) {
      return (data as { results: T[] }).results;
    }
    return data as T[];
  } catch {
    return fallback;
  }
}

// ─── CRUD helpers used by ResourcePage ───────────────────────────────────────

export async function createResource<T>(endpoint: string, body: Partial<T>): Promise<T> {
  return apiPost<T>(`/${endpoint}/`, body);
}

export async function updateResource<T>(endpoint: string, id: string, body: Partial<T>): Promise<T> {
  return apiPut<T>(`/${endpoint}/${id}/`, body);
}

export async function deleteResource(endpoint: string, id: string): Promise<void> {
  return apiDelete(`/${endpoint}/${id}/`);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  return apiGet("/auth/me/");
}

export async function logoutUser() {
  return apiPost("/auth/logout/", {});
}

// ─── Fallback data (shown when Django is unreachable) ────────────────────────

export const fallbackAdminData: AdminDashboardData = {
  metrics: [
    { label: "Monthly recurring revenue", value: "$186.2K", change: "+14.8%", tone: "positive" },
    { label: "Active users", value: "12,486", change: "+9.1%", tone: "positive" },
    { label: "Net retention", value: "124%", change: "+3.4%", tone: "positive" },
    { label: "Failed payments", value: "3", change: "-11.5%", tone: "positive" },
  ],
  tenants: [],
  users: [],
  plans: [],
  subscriptions: [],
  payments: [],
  analytics: {
    revenue: [
      { month: "Jan", value: 140 }, { month: "Feb", value: 152 },
      { month: "Mar", value: 161 }, { month: "Apr", value: 170 },
      { month: "May", value: 178 }, { month: "Jun", value: 186 },
    ],
    funnels: [
      { label: "Trial starts", value: "1,240", change: "+8.2%" },
      { label: "Activated", value: "834", change: "+5.1%" },
      { label: "Converted to paid", value: "412", change: "+12.4%" },
    ],
    segments: [
      { name: "At-risk accounts", count: 14, signal: "No login in 30+ days", priority: "High" },
      { name: "Expansion ready", count: 28, signal: "Near plan limits", priority: "Medium" },
      { name: "Failed billing", count: 6, signal: "Payment declined 2x", priority: "High" },
    ],
  },
  notifications: [],
  settings: [],
  payment_methods: [],
};