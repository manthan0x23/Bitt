import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/admin/join-organization')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/admin/join-organization"!</div>
}
