// components/RouteGuard.tsx
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/store/authStore'
import { useVerifyAuthentication } from '@/hooks/useVerifyAuth'
import { GlobalLoadingPage } from '@/components/common/global-loader'

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, isLoading, isError] = useStore(authStore, (state) => [
    state.user,
    state.isLoading,
    state.isError,
  ])
  useVerifyAuthentication()

  console.log(user)

  useEffect(() => {
    if (isLoading) return

    const path = router.state.location.pathname
    const isAuthRoute =
      path.startsWith('/auth') || path.startsWith('/admin/auth')
    const isAdminRoute = path.startsWith('/admin')

    if (!user) {
      if (!isAuthRoute) {
        router.navigate({
          to: '/auth/ladder',
        })
      }
    } else if (user.type === 'user' && isAdminRoute && !isAuthRoute) {
      router.navigate({
        to: '/auth/ladder',
      })
    }
  }, [user, isLoading, router.state.location])

  return <GlobalLoadingPage isLoading={isLoading} children={children} />
}
