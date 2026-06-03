import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { subscriptionColumns, subscriptionFields } from "../lib/resource-configs";
import type { Subscription } from "../types";

export default async function Page() {
  const subscriptions = await getResource<Subscription>("subscriptions", fallbackAdminData.subscriptions);

  return (
    <DashboardShell>
      <ResourcePage
        title="Subscriptions"
        subtitle="Create, upgrade, pause, cancel, and recover recurring subscriptions. Dashboard MRR updates from these records."
        endpoint="subscriptions"
        primaryAction="New subscription"
        idPrefix="sub"
        items={subscriptions as unknown as ResourceItem[]}
        fields={subscriptionFields}
        columns={subscriptionColumns}
      />
    </DashboardShell>
  );
}
