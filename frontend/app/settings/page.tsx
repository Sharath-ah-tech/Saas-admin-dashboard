import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { settingColumns, settingFields } from "../lib/resource-configs";
import type { SettingItem } from "../types";

export default async function Page() {
  const settings = await getResource<SettingItem>("settings", fallbackAdminData.settings);

  return (
    <DashboardShell>
      <ResourcePage
        title="System settings"
        subtitle="Edit security, billing, integration, retention, notification, and API settings."
        endpoint="settings"
        primaryAction="New setting"
        idPrefix="set"
        items={settings as unknown as ResourceItem[]}
        fields={settingFields}
        columns={settingColumns}
      />
    </DashboardShell>
  );
}
