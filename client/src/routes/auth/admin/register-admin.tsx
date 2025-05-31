import { RegisterAdmin } from '@/app/admin/auth/pages/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/admin/register-admin')({
  component: RegisterAdmin,
})

