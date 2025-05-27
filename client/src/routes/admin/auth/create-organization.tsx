import { CreateOrganization } from '@/app/admin/auth/create-organization'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/create-organization')({
  component: CreateOrganization,
})
