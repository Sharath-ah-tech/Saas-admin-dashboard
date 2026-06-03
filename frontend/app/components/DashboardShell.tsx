"use client";

import {
  Bell,
  Building2,
  ChartNoAxesColumnIncreasing,
  CreditCard,
  Gauge,
  LayoutDashboard,
  PackageCheck,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/tenants", label: "Tenants", icon: Building2 },
  { href: "/users", label: "Users", icon: Users },
  { href: "/subscriptions", label: "Subscriptions", icon: ReceiptText },
  { href: "/plans", label: "Plans", icon: PackageCheck },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesColumnIncreasing },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <div className="brandMark">
            <Gauge size={20} aria-hidden />
          </div>
          <div>
            <strong>AdminFlow</strong>
            <span>SaaS control center</span>
          </div>
        </Link>

        <nav className="navLinks">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link className={isActive ? "active" : ""} href={item.href} key={item.href}>
                <Icon size={18} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="gatewayCard">
          <span>Payment sandbox</span>
          <strong>Stripe + Razorpay</strong>
          <small>Dummy payments persist through the DRF API.</small>
        </div>
      </aside>
      <section className="workspace">{children}</section>
    </main>
  );
}
