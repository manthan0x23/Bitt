import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/create-organization')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/auth/create-organization"!</div>
}
