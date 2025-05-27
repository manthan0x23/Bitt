import { Ladder } from '@/app/auth/ladder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/ladder')({
  component: Ladder,
})
