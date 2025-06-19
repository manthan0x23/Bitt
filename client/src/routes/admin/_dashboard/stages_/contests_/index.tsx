import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_dashboard/stages_/contests_/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_dashboard/stages_/contests_/"!</div>
}
