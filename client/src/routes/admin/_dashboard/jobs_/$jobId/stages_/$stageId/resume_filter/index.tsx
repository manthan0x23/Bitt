import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/resume_filter/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/admin/_dashboard/jobs_/$jobId/stages_/$stageId/reume-filter/"!
    </div>
  )
}
