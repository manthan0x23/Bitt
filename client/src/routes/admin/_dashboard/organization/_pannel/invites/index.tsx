import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/_dashboard/organization/_pannel/invites/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_dashboard/organization/_pannel/invites/"!</div>
}
