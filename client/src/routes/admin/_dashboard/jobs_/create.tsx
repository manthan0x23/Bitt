import CreateJob from '@/app/admin/dashboard/pages/jobs/pages/create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/jobs_/create')({
  component: CreateJob,
});
