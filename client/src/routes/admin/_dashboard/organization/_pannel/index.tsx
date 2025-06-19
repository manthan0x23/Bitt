import { OrganizationInfo } from '@/app/admin/dashboard/pages/organization/pages/information';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/organization/_pannel/')(
  {
    component: OrganizationInfo,
  },
);
