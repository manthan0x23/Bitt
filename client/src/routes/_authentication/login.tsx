import LoginPage from '@/app/authentication/login/login-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authentication/login')({
  component: () => <LoginPage />,
})
