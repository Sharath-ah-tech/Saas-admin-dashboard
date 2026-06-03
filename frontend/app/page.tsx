import { DashboardShell } from "./components/DashboardShell";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { getAdminDashboard } from "./lib/admin-data";

export default async function DashboardPage() {
  const data = await getAdminDashboard();

  return (
    <DashboardShell>
      <OverviewDashboard data={data} />
    </DashboardShell>
  );
}
