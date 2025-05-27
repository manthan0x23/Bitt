import { OrganizationLadder } from '@/app/admin/auth/organization-ladder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/organization-ladder')({
  component: OrganizationLadder,
})
