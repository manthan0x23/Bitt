import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_dashboard/messages_/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_dashboard/messages/"!</div>
}
