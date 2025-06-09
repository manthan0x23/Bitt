import { StageViewAdmin } from '@/app/admin/dashboard/pages/stages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/',
)({
  component: StageViewAdmin,
});
