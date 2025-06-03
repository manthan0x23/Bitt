import { JobsPannel } from '@/app/admin/dashboard/pages/jobs/pages/main';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/jobs_/')({
  component: JobsPannel,
});
