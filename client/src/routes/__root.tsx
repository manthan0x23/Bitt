import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { RouteGuard } from '../integrations/guards/route-guard.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <RouteGuard>
      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </RouteGuard>
  ),
})
