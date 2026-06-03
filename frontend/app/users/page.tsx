import { DashboardShell } from "../components/DashboardShell";
import { ResourcePage, type ResourceItem } from "../components/ResourcePage";
import { fallbackAdminData, getResource } from "../lib/admin-data";
import { userColumns, userFields } from "../lib/resource-configs";
import type { AdminUser } from "../types";

export default async function Page() {
  const users = await getResource<AdminUser>("users", fallbackAdminData.users);

  return (
    <DashboardShell>
      <ResourcePage
        title="Users"
        subtitle="Invite, edit, suspend, and delete platform users. Saved changes are stored through the DRF users endpoint."
        endpoint="users"
        primaryAction="Invite user"
        idPrefix="usr"
        items={users as unknown as ResourceItem[]}
        fields={userFields}
        columns={userColumns}
      />
    </DashboardShell>
  );
}
