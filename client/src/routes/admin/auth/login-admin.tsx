import { LoginAdmin } from '@/app/admin/auth/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/auth/login-admin')({
  component: LoginAdmin,
})
