import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { tenantColumns, tenantFields } from "../lib/resource-configs";
import type { Tenant } from "../types";

export default async function Page() {
  const tenants = await getResource<Tenant>("tenants", fallbackAdminData.tenants);

  return (
    <DashboardShell>
      <ResourcePage
        title="Tenants"
        subtitle="Manage client organization profiles, subdomains, and status states. Changes are saved through the DRF tenants endpoint."
        endpoint="tenants"
        primaryAction="New tenant"
        idPrefix="tnt"
        items={tenants as unknown as ResourceItem[]}
        fields={tenantFields}
        columns={tenantColumns}
      />
    </DashboardShell>
  );
}
