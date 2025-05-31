import { CreateOrganizationPage } from '@/app/admin/auth/pages/create-organization';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/admin/create-organization')({
  component: CreateOrganizationPage,
});
