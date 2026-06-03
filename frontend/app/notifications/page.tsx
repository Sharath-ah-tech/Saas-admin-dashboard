import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { notificationColumns, notificationFields } from "../lib/resource-configs";
import type { NotificationRule } from "../types";

export default async function Page() {
  const notifications = await getResource<NotificationRule>("notifications", fallbackAdminData.notifications);

  return (
    <DashboardShell>
      <ResourcePage
        title="Notifications"
        subtitle="Manage email, SMS, webhook, and in-app notification rules for platform events."
        endpoint="notifications"
        primaryAction="New rule"
        idPrefix="ntf"
        items={notifications as unknown as ResourceItem[]}
        fields={notificationFields}
        columns={notificationColumns}
      />
    </DashboardShell>
  );
}
