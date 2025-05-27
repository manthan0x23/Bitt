import { RegisterAdmin } from '@/app/admin/auth/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/register-admin')({
  component: RegisterAdmin,
})
