import { JoinOrganization } from '@/app/admin/auth/pages/join-organization';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/admin/join-organization')({
  component: JoinOrganization,
});
