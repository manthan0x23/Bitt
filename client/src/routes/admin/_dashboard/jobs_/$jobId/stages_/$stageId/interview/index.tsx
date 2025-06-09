import { AdminInterviewStageView } from '@/app/admin/dashboard/pages/stages/interview';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/interview/',
)({
  component: AdminInterviewStageView,
});
