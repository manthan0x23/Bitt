import { RegisterPage } from '@/app/auth/login/register-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})
