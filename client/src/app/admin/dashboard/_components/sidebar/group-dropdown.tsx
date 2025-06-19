import { useState } from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { IconType } from 'react-icons';
import { Link, useLocation } from '@tanstack/react-router';

interface SideBarDropdownProps {
  icon: IconType;
  icon_line: IconType;
  title: string;
  url: string;
  children: {
    title: string;
    url: string;
  }[];
}

export const SideBarDropdownGroup = ({
  icon: FilledIcon,
  icon_line: OutlineIcon,
  title,
  url,
  children,
}: SideBarDropdownProps) => {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const isActive = false;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pathname == '/admin/stages/' || pathname == '/admin/stages'}
          className="flex items-center justify-between w-full"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-2">
            {isActive ? (
              <FilledIcon className="size-4" />
            ) : (
              <OutlineIcon className="size-4" />
            )}
            <Link to={url} className="text-sm font-medium">
              {title}
            </Link>
          </div>
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      {(expanded || pathname.startsWith('/admin/stages')) &&
        children.map((item) => (
          <SidebarMenuItem key={item.url} className="pl-6">
            <SidebarMenuButton isActive={pathname.startsWith(item.url)} asChild>
              <Link
                to={item.url}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
};
