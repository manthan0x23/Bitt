import { CreateOrganizationPage } from '@/app/admin/auth/pages/create-organization';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/auth/create-organization')({
  component: CreateOrganizationPage,
});
