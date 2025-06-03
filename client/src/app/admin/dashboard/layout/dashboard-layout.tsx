import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';
import { SideBar } from '../_components/sidebar/sidebar';
import { NavBar } from '../_components/navbar';

export const AdminDashBoardLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <SideBar variant="inset" />
      <SidebarInset>
        <section className="h-full w-full flex flex-col items-center justify-center p-2">
          <NavBar />
          <div className="w-full h-[95%] p-4 ">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};
