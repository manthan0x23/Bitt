import { QuizPannelAdmin } from '@/app/admin/dashboard/pages/stages/quiz';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
)({
  component: QuizPannelAdmin,
});
