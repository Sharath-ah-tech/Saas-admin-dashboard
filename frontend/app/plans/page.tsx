import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { planColumns, planFields } from "../lib/resource-configs";
import type { Plan } from "../types";

export default async function Page() {
  const plans = await getResource<Plan>("plans", fallbackAdminData.plans);

  return (
    <DashboardShell>
      <ResourcePage
        title="Plans"
        subtitle="Create and manage pricing plans, feature limits, and catalog visibility."
        endpoint="plans"
        primaryAction="New plan"
        idPrefix="plan"
        items={plans as unknown as ResourceItem[]}
        fields={planFields}
        columns={planColumns}
      />
    </DashboardShell>
  );
}
