export type Tone = "positive" | "negative";

export type Metric = {
  label: string;
  value: string;
  change: string;
  tone: Tone;
};

export type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  status: string;
};

export type AdminUser = {
  id: string;
  tenant?: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: string;
  mfa: boolean;
  last_seen: string;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  interval: string;
  customers: number;
  features: string[];
  status: string;
};

export type Subscription = {
  id: string;
  tenant?: string;
  customer: string;
  plan: string;
  status: string;
  billing_cycle: string;
  renewal_date: string;
  mrr: string;
  payment_method: string;
};

export type Payment = {
  id: string;
  tenant?: string;
  provider: string;
  customer: string;
  amount: string;
  method: string;
  status: string;
  captured: boolean;
  settlement: string;
};

export type RevenuePoint = {
  month: string;
  value: number;
};

export type Funnel = {
  label: string;
  value: string;
  change: string;
};

export type Segment = {
  name: string;
  count: number;
  signal: string;
  priority: string;
};

export type Analytics = {
  revenue: RevenuePoint[];
  funnels: Funnel[];
  segments: Segment[];
};

export type NotificationRule = {
  id: string;
  channel: string;
  title: string;
  audience: string;
  status: string;
};

export type SettingItem = {
  id: string;
  tenant?: string;
  group: string;
  label: string;
  value: string;
};

export type PaymentMethod = {
  id: string;
  provider: string;
  mode: string;
  capabilities: string[];
  status: string;
};

export type AdminDashboardData = {
  metrics: Metric[];
  tenants: Tenant[];
  users: AdminUser[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
  analytics: Analytics;
  notifications: NotificationRule[];
  settings: SettingItem[];
  payment_methods: PaymentMethod[];
};
