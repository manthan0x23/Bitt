import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/join-organization')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/auth/join-organization"!</div>
}
