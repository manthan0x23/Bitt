import { AdminDashBoard } from '@/app/admin/dashboard/pages/home/main';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_dashboard/')({
  component: AdminDashBoard,
});
