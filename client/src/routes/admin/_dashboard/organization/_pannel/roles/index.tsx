import { OrganizationRoles } from '@/app/admin/dashboard/pages/organization/pages/roles';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/organization/_pannel/roles/',
)({
  component: OrganizationRoles,
});
