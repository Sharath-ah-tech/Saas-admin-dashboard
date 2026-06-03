import type { ColumnConfig, FieldConfig } from "../components/ResourcePage";

export const tenantFields: FieldConfig[] = [
  { key: "id", label: "Tenant ID" },
  { key: "name", label: "Name" },
  { key: "subdomain", label: "Subdomain" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Suspended"] },
];

export const tenantColumns: ColumnConfig[] = [
  { key: "name", label: "Tenant", secondaryKey: "subdomain" },
  { key: "id", label: "Tenant ID" },
  { key: "status", label: "Status", badge: true },
];

export const userFields: FieldConfig[] = [
  { key: "id", label: "User ID" },
  { key: "tenant", label: "Tenant ID", placeholder: "e.g. tnt_atlas" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "role", label: "Role", type: "select", options: ["Owner", "Admin", "Billing admin", "Support lead", "Member"] },
  { key: "company", label: "Company" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Invited", "Suspended"] },
  { key: "mfa", label: "MFA enabled", type: "checkbox" },
  { key: "last_seen", label: "Last seen" },
];

export const userColumns: ColumnConfig[] = [
  { key: "name", label: "User", secondaryKey: "email" },
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "tenant", label: "Tenant" },
  { key: "status", label: "Status", badge: true },
  { key: "mfa", label: "MFA" },
];

export const planFields: FieldConfig[] = [
  { key: "id", label: "Plan ID" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "interval", label: "Interval", type: "select", options: ["Monthly", "Annual"] },
  { key: "customers", label: "Customers", type: "number" },
  { key: "features", label: "Features", type: "array", placeholder: "Comma-separated features" },
  { key: "status", label: "Status", type: "select", options: ["Public", "Approval only", "Archived"] },
];

export const planColumns: ColumnConfig[] = [
  { key: "name", label: "Plan", secondaryKey: "id" },
  { key: "price", label: "Price" },
  { key: "interval", label: "Interval" },
  { key: "customers", label: "Customers" },
  { key: "status", label: "Status", badge: true },
];

export const subscriptionFields: FieldConfig[] = [
  { key: "id", label: "Subscription ID" },
  { key: "tenant", label: "Tenant ID", placeholder: "e.g. tnt_atlas" },
  { key: "customer", label: "Customer" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Past due", "Trialing", "Canceled", "Paused"] },
  { key: "billing_cycle", label: "Billing cycle", type: "select", options: ["Monthly", "Annual"] },
  { key: "renewal_date", label: "Renewal date", type: "date" },
  { key: "mrr", label: "MRR" },
  { key: "payment_method", label: "Payment method" },
];

export const subscriptionColumns: ColumnConfig[] = [
  { key: "customer", label: "Customer", secondaryKey: "payment_method" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status", badge: true },
  { key: "tenant", label: "Tenant" },
  { key: "billing_cycle", label: "Cycle" },
  { key: "mrr", label: "MRR" },
];

export const paymentFields: FieldConfig[] = [
  { key: "id", label: "Payment ID" },
  { key: "tenant", label: "Tenant ID", placeholder: "e.g. tnt_atlas" },
  { key: "provider", label: "Provider", type: "select", options: ["Stripe", "Razorpay", "PayPal", "Manual invoice"] },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status", type: "select", options: ["Succeeded", "Retry scheduled", "Awaiting payment", "Refunded", "Failed"] },
  { key: "captured", label: "Captured", type: "checkbox" },
  { key: "settlement", label: "Settlement" },
];

export const paymentColumns: ColumnConfig[] = [
  { key: "id", label: "Payment", secondaryKey: "provider" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "tenant", label: "Tenant" },
  { key: "status", label: "Status", badge: true },
  { key: "settlement", label: "Settlement" },
];

export const notificationFields: FieldConfig[] = [
  { key: "id", label: "Notification ID" },
  { key: "channel", label: "Channel", type: "select", options: ["Email", "Webhook", "SMS", "In-app"] },
  { key: "title", label: "Title" },
  { key: "audience", label: "Audience" },
  { key: "status", label: "Status", type: "select", options: ["Enabled", "Paused", "Healthy"] },
];

export const notificationColumns: ColumnConfig[] = [
  { key: "title", label: "Rule", secondaryKey: "id" },
  { key: "channel", label: "Channel" },
  { key: "audience", label: "Audience" },
  { key: "status", label: "Status", badge: true },
];

export const settingFields: FieldConfig[] = [
  { key: "id", label: "Setting ID" },
  { key: "tenant", label: "Tenant ID", placeholder: "e.g. tnt_atlas" },
  { key: "group", label: "Group", type: "select", options: ["Security", "Billing", "Integrations", "Data", "Notifications"] },
  { key: "label", label: "Label" },
  { key: "value", label: "Value" },
];

export const settingColumns: ColumnConfig[] = [
  { key: "group", label: "Group" },
  { key: "label", label: "Setting" },
  { key: "tenant", label: "Tenant" },
  { key: "value", label: "Value" },
];
