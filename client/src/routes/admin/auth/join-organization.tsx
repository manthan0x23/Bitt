import { JoinOrganization } from '@/app/admin/auth/join-organization'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/join-organization')({
  component: JoinOrganization,
})
