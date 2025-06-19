import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/_dashboard/organization/_pannel/roles/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_dashboard/organization/_pannel/roles/"!</div>
}
