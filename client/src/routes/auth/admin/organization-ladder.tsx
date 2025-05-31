import { OrganizationLadder } from '@/app/admin/auth/pages/organization-ladder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/admin/organization-ladder')({
  component: OrganizationLadder,
})
