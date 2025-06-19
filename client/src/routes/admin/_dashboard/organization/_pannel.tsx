import { OrganizationSettingsLayout } from '@/app/admin/dashboard/pages/organization/layout/organization-settings-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/organization/_pannel')({
  component: () => (
    <OrganizationSettingsLayout>
      <Outlet />
    </OrganizationSettingsLayout>
  ),
});
