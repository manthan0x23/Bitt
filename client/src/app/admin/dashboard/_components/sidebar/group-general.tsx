import * as React from 'react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { IconType } from 'react-icons/lib';
import { Link, useLocation } from '@tanstack/react-router';

interface SideBarGroupGeneralProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  title?: string;
  items: {
    title: string;
    url: string;
    icon: IconType;
  }[];
}

export function SideBarGroupGeneral({
  title,
  items,
  ...props
}: SideBarGroupGeneralProps) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup {...props}>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
