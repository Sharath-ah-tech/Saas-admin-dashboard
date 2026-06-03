import { Activity, ChartNoAxesColumnIncreasing, Sparkles } from "lucide-react";

import { DashboardShell } from "../components/DashboardShell";
import { PanelTitle } from "../components/PanelTitle";
import { getAdminDashboard } from "../lib/admin-data";

export default async function Page() {
  const data = await getAdminDashboard();
  const maxRevenue = Math.max(...data.analytics.revenue.map((item) => item.value));

  return (
    <DashboardShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Revenue, activation, retention, and payment performance.</h1>
        </div>
      </header>

      <section className="splitGrid">
        <article className="panel revenuePanel">
          <PanelTitle
            icon={<ChartNoAxesColumnIncreasing size={18} aria-hidden />}
            title="Revenue trend"
            subtitle="Latest month recalculates from subscription MRR stored in the database."
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
        </article>

        <article className="panel">
          <PanelTitle
            icon={<Activity size={18} aria-hidden />}
            title="Conversion funnel"
            subtitle="Trial, activation, and paid conversion signals."
          />
          <div className="funnelGrid singleColumn">
            {data.analytics.funnels.map((funnel) => (
              <div key={funnel.label}>
                <span>{funnel.label}</span>
                <strong>{funnel.value}</strong>
                <small>{funnel.change}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <PanelTitle
          icon={<Sparkles size={18} aria-hidden />}
          title="Admin action segments"
          subtitle="Segments that need review, outreach, or billing recovery."
        />
        <div className="actionList">
          {data.analytics.segments.map((segment) => (
            <div className="actionItem" key={segment.name}>
              <div className="actionIcon">
                <Sparkles size={18} aria-hidden />
              </div>
              <div>
                <strong>{segment.name}</strong>
                <span>{segment.signal}</span>
              </div>
              <div className="actionMeta">
                <b>{segment.count}</b>
                <mark className={`badge ${segment.priority.toLowerCase()}`}>{segment.priority}</mark>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
