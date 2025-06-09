import { StageEdit } from '@/app/admin/dashboard/pages/stages/edit-stage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/edit',
)({
  component: StageEdit,
});
