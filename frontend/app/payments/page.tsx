import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { paymentColumns, paymentFields } from "../lib/resource-configs";
import type { Payment } from "../types";

export default async function Page() {
  const payments = await getResource<Payment>("payments", fallbackAdminData.payments);

  return (
    <DashboardShell>
      <ResourcePage
        title="Payments"
        subtitle="Create, edit, and delete platform payment records. Saved changes are stored in the database."
        endpoint="payments"
        primaryAction="New payment"
        idPrefix="pay"
        items={payments as unknown as ResourceItem[]}
        fields={paymentFields}
        columns={paymentColumns}
      />
    </DashboardShell>
  );
}
