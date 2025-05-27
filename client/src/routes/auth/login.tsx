import { LoginPage } from '@/app/auth/login/login-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})
