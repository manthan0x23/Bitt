import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx';
import type { QueryClient } from '@tanstack/react-query';
import { RouteGuard } from '../integrations/guards/route-guard.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <RouteGuard>
      <Outlet />
      <TanStackQueryLayout />
      <Toaster />
    </RouteGuard>
  ),
});
