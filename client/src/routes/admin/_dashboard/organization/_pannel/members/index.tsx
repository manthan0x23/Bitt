import { OrganizationMembers } from '@/app/admin/dashboard/pages/organization/pages/members';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/organization/_pannel/members/',
)({
  component: OrganizationMembers,
});
