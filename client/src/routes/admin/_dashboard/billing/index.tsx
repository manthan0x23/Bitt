import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_dashboard/billing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_dashboard/billing/"!</div>
}
