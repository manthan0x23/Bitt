import { EditJob } from '@/app/admin/dashboard/pages/jobs/edit-job';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/jobs_/$jobId/edit')({
  component: EditJob,
});
