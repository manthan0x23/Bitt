import { JobsPannelAdmin } from '@/app/admin/dashboard/pages/jobs';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/jobs_/')({
  component: JobsPannelAdmin,
});
