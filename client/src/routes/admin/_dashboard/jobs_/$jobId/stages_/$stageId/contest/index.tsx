import { ContestPannelAdmin } from '@/app/admin/dashboard/pages/stages/contest';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
)({
  component: ContestPannelAdmin,
});
