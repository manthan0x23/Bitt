import { AdminDashBoardLayout } from '@/app/admin/dashboard/layout/dashboard-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard')({
  component: () => (
    <AdminDashBoardLayout>
      <Outlet />
    </AdminDashBoardLayout>
  ),
});
