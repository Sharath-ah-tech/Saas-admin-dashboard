"use client";

import {
  BadgeDollarSign,
  Bell,
  Building2,
  ChartNoAxesColumnIncreasing,
  CreditCard,
  KeyRound,
  Mail,
  PackageCheck,
  ReceiptText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { AdminDashboardData } from "../types";
import { PanelTitle, statusClass } from "./PanelTitle";

export function OverviewDashboard({ data }: { data: AdminDashboardData }) {
  const [searchQuery, setSearchQuery] = useState("");

  const maxRevenue = Math.max(...data.analytics.revenue.map((item) => item.value));
  const activeUsers = data.users.filter((user) => user.status === "Active").length;
  const pastDueSubscriptions = data.subscriptions.filter((item) => item.status === "Past due").length;
  const capturedPayments = data.payments.filter((payment) => payment.captured).length;

  const query = searchQuery.toLowerCase().trim();

  // Search filtering logic across different dashboard resource lists
  const filteredUsers = data.users.filter((user) => {
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      (user.tenant && user.tenant.toLowerCase().includes(query))
    );
  });

  const filteredPlans = data.plans.filter((plan) => {
    if (!query) return true;
    return (
      plan.name.toLowerCase().includes(query) ||
      plan.id.toLowerCase().includes(query)
    );
  });

  const filteredPayments = data.payments.filter((payment) => {
    if (!query) return true;
    return (
      payment.id.toLowerCase().includes(query) ||
      payment.customer.toLowerCase().includes(query) ||
      payment.provider.toLowerCase().includes(query) ||
      payment.method.toLowerCase().includes(query) ||
      (payment.tenant && payment.tenant.toLowerCase().includes(query))
    );
  });

  const filteredSubscriptions = data.subscriptions.filter((sub) => {
    if (!query) return true;
    return (
      sub.customer.toLowerCase().includes(query) ||
      sub.plan.toLowerCase().includes(query) ||
      sub.payment_method.toLowerCase().includes(query) ||
      (sub.tenant && sub.tenant.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Multi-Tenant central command</p>
          <h1>Manage tenants, users, subscriptions, payments, and system controls.</h1>
        </div>
        <div className="topActions">
          <label className="searchBox">
            <Search size={18} aria-hidden />
            <input
              placeholder="Search tenants, users, subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <Link className="iconButton" aria-label="Manage tenants" href="/tenants" title="Manage tenants">
            <Building2 size={18} aria-hidden />
          </Link>
          <Link className="iconButton" aria-label="Invite user" href="/users" title="Invite user">
            <UserPlus size={18} aria-hidden />
          </Link>
          <Link className="iconButton" aria-label="Notification center" href="/notifications" title="Notification center">
            <Bell size={18} aria-hidden />
          </Link>
        </div>
      </header>

      <section className="metricGrid" aria-label="Key metrics">
        {data.metrics.map((metric) => (
          <article className="metricCard" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small className={metric.tone}>{metric.change} vs last month</small>
          </article>
        ))}
      </section>

      <section className="opsGrid" aria-label="Operating summary">
        <article className="panel quickPanel">
          <span>Active users</span>
          <strong>{activeUsers} / {data.users.length}</strong>
          <small>MFA and role coverage tracked per admin.</small>
        </article>
        <article className="panel quickPanel warning">
          <span>Past due subscriptions</span>
          <strong>{pastDueSubscriptions}</strong>
          <small>Smart retries and billing alerts ready.</small>
        </article>
        <article className="panel quickPanel">
          <span>Captured payments</span>
          <strong>{capturedPayments} / {data.payments.length}</strong>
          <small>Provider, method, settlement, and status visible.</small>
        </article>
      </section>

      <section className="splitGrid">
        <article className="panel">
          <PanelTitle
            icon={<Users size={18} aria-hidden />}
            title="Users"
            subtitle="Admins, customer owners, roles, MFA, and invite status."
            action="Open users"
          />
          <div className="dataTable userTable">
            <div className="tableRow tableHead">
              <span>User</span>
              <span>Role</span>
              <span>Company</span>
              <span>Tenant ID</span>
              <span>Status</span>
              <span>MFA</span>
              <span>Last seen</span>
            </div>
            {filteredUsers.slice(0, 4).map((user) => (
              <div className="tableRow" key={user.id}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <span>{user.role}</span>
                <span>{user.company}</span>
                <span>{user.tenant || "-"}</span>
                <mark className={statusClass(user.status)}>{user.status}</mark>
                <span>{user.mfa ? "Enabled" : "Missing"}</span>
                <span>{user.last_seen}</span>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
                No matching users found
              </div>
            )}
          </div>
          <Link className="panelLink" href="/users">Manage users</Link>
        </article>

        <article className="panel">
          <PanelTitle
            icon={<PackageCheck size={18} aria-hidden />}
            title="Plans"
            subtitle="Pricing catalog with intervals, features, and visibility."
            action="Open plans"
          />
          <div className="planGrid">
            {filteredPlans.slice(0, 3).map((plan) => (
              <div className="planCard" key={plan.id}>
                <div className="planTop">
                  <div>
                    <strong>{plan.name}</strong>
                    <span>{plan.customers} customers</span>
                  </div>
                  <mark>{plan.status}</mark>
                </div>
                <div className="priceLine">
                  <b>{plan.price}</b>
                  <span>{plan.interval}</span>
                </div>
              </div>
            ))}
            {filteredPlans.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", width: "100%" }}>
                No matching plans found
              </div>
            )}
          </div>
          <Link className="panelLink" href="/plans">Manage plans</Link>
        </article>
      </section>

      <section className="splitGrid">
        <article className="panel">
          <PanelTitle
            icon={<CreditCard size={18} aria-hidden />}
            title="Payments"
            subtitle="Gateway payments, capture state, refunds, and settlements."
            action="Open payments"
          />
          <div className="dataTable paymentsTable">
            <div className="tableRow tableHead">
              <span>Payment</span>
              <span>Customer</span>
              <span>Tenant ID</span>
              <span>Amount</span>
              <span>Method</span>
              <span>Status</span>
              <span>Settlement</span>
            </div>
            {filteredPayments.slice(0, 4).map((payment) => (
              <div className="tableRow" key={payment.id}>
                <div>
                  <strong>{payment.id}</strong>
                  <span>{payment.provider}</span>
                </div>
                <span>{payment.customer}</span>
                <span>{payment.tenant || "-"}</span>
                <strong>{payment.amount}</strong>
                <span>{payment.method}</span>
                <mark className={statusClass(payment.status)}>{payment.status}</mark>
                <span>{payment.settlement}</span>
              </div>
            ))}
            {filteredPayments.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
                No matching payments found
              </div>
            )}
          </div>
          <Link className="panelLink" href="/payments">Manage payments</Link>
        </article>

        <article className="panel">
          <PanelTitle
            icon={<ReceiptText size={18} aria-hidden />}
            title="Subscriptions"
            subtitle="Recurring plans, renewal dates, trials, and dunning."
            action="Open subscriptions"
          />
          <div className="actionList">
            {filteredSubscriptions.slice(0, 4).map((subscription) => (
              <div className="actionItem" key={subscription.id}>
                <div className="actionIcon">
                  <Sparkles size={18} aria-hidden />
                </div>
                <div>
                  <strong>{subscription.customer}</strong>
                  <span>{subscription.plan} / {subscription.payment_method}</span>
                  {subscription.tenant && <small style={{ display: "block", color: "var(--text-secondary)" }}>Tenant: {subscription.tenant}</small>}
                </div>
                <div className="actionMeta">
                  <b>{subscription.mrr}</b>
                  <mark className={statusClass(subscription.status)}>{subscription.status}</mark>
                </div>
              </div>
            ))}
            {filteredSubscriptions.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
                No matching subscriptions found
              </div>
            )}
          </div>
          <Link className="panelLink" href="/subscriptions">Manage subscriptions</Link>
        </article>
      </section>

      <section className="splitGrid">
        <article className="panel revenuePanel">
          <PanelTitle
            icon={<ChartNoAxesColumnIncreasing size={18} aria-hidden />}
            title="Analytics"
            subtitle="Revenue, conversion, retention, and payment performance."
            action="Open analytics"
          />
          <div className="barChart" aria-label="Revenue by month">
            {data.analytics.revenue.map((item) => (
              <div className="barGroup" key={item.month}>
                <div className="barTrack">
                  <div className="barFill" style={{ height: `${(item.value / maxRevenue) * 100}%` }} />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
          <Link className="panelLink" href="/analytics">View analytics</Link>
        </article>

        <article className="panel">
          <PanelTitle
            icon={<WalletCards size={18} aria-hidden />}
            title="Payment methods"
            subtitle="Stripe, Razorpay, PayPal, UPI, cards, invoices, and payment links."
            action="Open payments"
          />
          <div className="gatewayGrid">
            {data.payment_methods.map((method) => (
              <div className="gatewayItem" key={method.provider}>
                <div>
                  <strong>{method.provider}</strong>
                  <span>{method.mode} mode</span>
                  <small>{method.capabilities.join(" / ")}</small>
                </div>
                <mark>{method.status}</mark>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="splitGrid bottomGrid">
        <article className="panel">
          <PanelTitle
            icon={<Mail size={18} aria-hidden />}
            title="Notifications"
            subtitle="Email, SMS, webhook, and in-app rules."
            action="Open notifications"
          />
          <div className="notificationList">
            {data.notifications.slice(0, 4).map((notification) => (
              <div className="notificationItem" key={notification.id}>
                <div>
                  <strong>{notification.title}</strong>
                  <span>{notification.channel} to {notification.audience}</span>
                </div>
                <mark className={statusClass(notification.status)}>{notification.status}</mark>
              </div>
            ))}
          </div>
          <Link className="panelLink" href="/notifications">Manage notifications</Link>
        </article>

        <article className="panel">
          <PanelTitle
            icon={<SlidersHorizontal size={16} aria-hidden />}
            title="System settings"
            subtitle="Security, billing, integrations, retention, and API controls."
            action="Open settings"
          />
          <div className="settingsGrid">
            {data.settings.slice(0, 4).map((setting) => (
              <div className="settingItem" key={setting.id}>
                <span>{setting.group}</span>
                <strong>{setting.label}</strong>
                <small>{setting.value}</small>
              </div>
            ))}
          </div>
          <div className="settingsActions">
            <Link href="/settings">
              <ShieldCheck size={16} aria-hidden />
              Security
            </Link>
            <Link href="/settings">
              <BadgeDollarSign size={16} aria-hidden />
              Billing
            </Link>
            <Link href="/settings">
              <KeyRound size={16} aria-hidden />
              API keys
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
