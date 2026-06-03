import type { AdminDashboardData } from "../types";

export const fallbackAdminData: AdminDashboardData = {
  metrics: [
    { label: "Monthly recurring revenue", value: "$186.2K", change: "+14.8%", tone: "positive" },
    { label: "Active users", value: "12,486", change: "+9.1%", tone: "positive" },
    { label: "Net retention", value: "118%", change: "+3.4%", tone: "positive" },
    { label: "Failed payments", value: "27", change: "-11.5%", tone: "positive" },
  ],
  users: [
    {
      id: "usr_1001",
      name: "Maya Chen",
      email: "maya@atlasfinance.com",
      role: "Owner",
      company: "Atlas Finance",
      status: "Active",
      mfa: true,
      last_seen: "2 minutes ago",
    },
    {
      id: "usr_1002",
      name: "Arjun Mehta",
      email: "arjun@brightops.io",
      role: "Billing admin",
      company: "BrightOps",
      status: "Invited",
      mfa: false,
      last_seen: "Pending invite",
    },
    {
      id: "usr_1003",
      name: "Elena Brooks",
      email: "elena@northstar.dev",
      role: "Support lead",
      company: "Northstar Labs",
      status: "Active",
      mfa: true,
      last_seen: "18 minutes ago",
    },
    {
      id: "usr_1004",
      name: "Daniel Park",
      email: "daniel@pixelfoundry.studio",
      role: "Member",
      company: "Pixel Foundry",
      status: "Suspended",
      mfa: false,
      last_seen: "12 days ago",
    },
  ],
  plans: [
    {
      id: "plan_starter",
      name: "Starter",
      price: "$29",
      interval: "Monthly",
      customers: 184,
      features: ["5 seats", "Email support", "Basic analytics"],
      status: "Public",
    },
    {
      id: "plan_growth",
      name: "Growth",
      price: "$99",
      interval: "Monthly",
      customers: 392,
      features: ["25 seats", "Usage alerts", "Advanced reports"],
      status: "Public",
    },
    {
      id: "plan_enterprise",
      name: "Enterprise",
      price: "Custom",
      interval: "Annual",
      customers: 76,
      features: ["SSO/SAML", "SCIM", "Dedicated CSM"],
      status: "Approval only",
    },
  ],
  subscriptions: [
    {
      id: "sub_atlas_001",
      customer: "Atlas Finance",
      plan: "Enterprise",
      status: "Active",
      billing_cycle: "Annual",
      renewal_date: "2026-08-14",
      mrr: "$24,800",
      payment_method: "Stripe card",
    },
    {
      id: "sub_bright_008",
      customer: "BrightOps",
      plan: "Growth",
      status: "Past due",
      billing_cycle: "Monthly",
      renewal_date: "2026-06-05",
      mrr: "$7,920",
      payment_method: "Razorpay UPI",
    },
    {
      id: "sub_north_004",
      customer: "Northstar Labs",
      plan: "Enterprise",
      status: "Active",
      billing_cycle: "Annual",
      renewal_date: "2026-11-21",
      mrr: "$18,600",
      payment_method: "Wire transfer",
    },
    {
      id: "sub_pixel_011",
      customer: "Pixel Foundry",
      plan: "Starter",
      status: "Trialing",
      billing_cycle: "Monthly",
      renewal_date: "2026-06-16",
      mrr: "$348",
      payment_method: "Stripe card",
    },
  ],
  payments: [
    {
      id: "pay_9Q8A11",
      provider: "Stripe",
      customer: "Atlas Finance",
      amount: "$24,800",
      method: "Visa ending 4242",
      status: "Succeeded",
      captured: true,
      settlement: "2026-06-04",
    },
    {
      id: "pay_RZP_5602",
      provider: "Razorpay",
      customer: "BrightOps",
      amount: "$7,920",
      method: "UPI mandate",
      status: "Retry scheduled",
      captured: false,
      settlement: "Pending",
    },
    {
      id: "pay_PP_2026",
      provider: "PayPal",
      customer: "Northstar Labs",
      amount: "$18,600",
      method: "Business account",
      status: "Succeeded",
      captured: true,
      settlement: "2026-06-06",
    },
    {
      id: "pay_MAN_334",
      provider: "Manual invoice",
      customer: "Pixel Foundry",
      amount: "$348",
      method: "Payment link",
      status: "Awaiting payment",
      captured: false,
      settlement: "Not settled",
    },
  ],
  analytics: {
    revenue: [
      { month: "Jan", value: 108 },
      { month: "Feb", value: 122 },
      { month: "Mar", value: 139 },
      { month: "Apr", value: 151 },
      { month: "May", value: 168 },
      { month: "Jun", value: 186 },
    ],
    funnels: [
      { label: "Trials started", value: "1,420", change: "+18%" },
      { label: "Activated teams", value: "842", change: "+11%" },
      { label: "Paid conversions", value: "268", change: "+6%" },
    ],
    segments: [
      { name: "Expansion ready", count: 184, signal: "Seat usage above 85%", priority: "High" },
      { name: "Churn watch", count: 37, signal: "Low activity and failed renewal", priority: "Urgent" },
      { name: "Onboarding", count: 92, signal: "Setup checklist incomplete", priority: "Medium" },
    ],
  },
  notifications: [
    { id: "ntf_001", channel: "Email", title: "Payment failure digest", audience: "Billing admins", status: "Enabled" },
    { id: "ntf_002", channel: "Webhook", title: "subscription.updated", audience: "Finance systems", status: "Healthy" },
    { id: "ntf_003", channel: "SMS", title: "Trial ending reminder", audience: "Workspace owners", status: "Paused" },
    { id: "ntf_004", channel: "In-app", title: "Security review required", audience: "Super admins", status: "Enabled" },
  ],
  settings: [
    { id: "set_001", group: "Security", label: "Require MFA for admins", value: "Enabled" },
    { id: "set_002", group: "Billing", label: "Smart payment retries", value: "3 attempts over 7 days" },
    { id: "set_003", group: "Integrations", label: "Payment gateways", value: "Stripe, Razorpay, PayPal" },
    { id: "set_004", group: "Data", label: "Audit log retention", value: "365 days" },
    { id: "set_005", group: "Notifications", label: "Webhook signing", value: "Rotated monthly" },
  ],
  payment_methods: [
    { id: "pm_stripe", provider: "Stripe", mode: "Test", capabilities: ["Cards", "Invoices", "Refunds"], status: "Connected" },
    { id: "pm_razorpay", provider: "Razorpay", mode: "Test", capabilities: ["UPI", "Payment links", "Subscriptions"], status: "Connected" },
    { id: "pm_paypal", provider: "PayPal", mode: "Sandbox", capabilities: ["Wallet", "Cross-border"], status: "Ready" },
  ],
  tenants: [
    { id: "tnt_atlas", name: "Atlas Finance", subdomain: "atlas", status: "Active" },
    { id: "tnt_bright", name: "BrightOps", subdomain: "bright", status: "Active" },
    { id: "tnt_north", name: "Northstar Labs", subdomain: "northstar", status: "Active" },
    { id: "tnt_pixel", name: "Pixel Foundry", subdomain: "pixel", status: "Suspended" },
  ],
};

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const response = await fetch(`${apiBaseUrl}/admin-dashboard/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackAdminData;
    }

    const payload = (await response.json()) as Partial<AdminDashboardData>;

    return {
      ...fallbackAdminData,
      ...payload,
      analytics: {
        ...fallbackAdminData.analytics,
        ...payload.analytics,
      },
    };
  } catch {
    return fallbackAdminData;
  }
}

export async function getResource<T>(
  endpoint: string,
  fallback: T[],
): Promise<T[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = await response.json();

    if (Array.isArray(payload)) {
      return payload as T[];
    }

    return (payload.results ?? fallback) as T[];
  } catch {
    return fallback;
  }
}
