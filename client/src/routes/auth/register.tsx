import { RegisterPage } from '@/app/auth/pages/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})
