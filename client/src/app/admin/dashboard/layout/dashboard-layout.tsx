import { SidebarProvider } from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';
import { SideBar } from '../_components/sidebar';

export const AdminDashBoardLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider className="screen-full border-0">
      <SideBar />
      <section className="h-full w-full bg-accent p-2">{children}</section>
    </SidebarProvider>
  );
};
