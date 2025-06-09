import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/"!</div>
  )
}
