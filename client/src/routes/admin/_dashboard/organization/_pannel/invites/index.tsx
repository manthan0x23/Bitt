import { OrganizationInvites } from '@/app/admin/dashboard/pages/organization/pages/invites';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/organization/_pannel/invites/',
)({
  component: OrganizationInvites,
});
