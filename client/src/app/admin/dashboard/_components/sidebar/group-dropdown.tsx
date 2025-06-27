import { useState } from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { IconType } from 'react-icons';
import { Link, useLocation } from '@tanstack/react-router';
import type { StageTypeEnumT } from '@/lib/types/stages';
import { cn } from '@/lib/utils';

interface SideBarDropdownProps {
  icon: IconType;
  icon_line: IconType;
  title: string;
  url: string;
  children: {
    title: string;
    url: string;
    stage: StageTypeEnumT;
  }[];
}

const stageColorMap: Record<StageTypeEnumT, string> = {
  contest: 'bg-orange-400 dark:bg-orange-500',
  interview: 'bg-indigo-400 dark:bg-indigo-500',
  resume_filter: 'bg-green-400 dark:bg-green-500',
  quiz: 'bg-pink-400 dark:bg-pink-500',
};

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
          size={'sm'}
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
      <div
        className={`transition-all duration-300 animate-in animate-out overflow-hidden ${
          expanded || pathname.startsWith('/admin/stages')
            ? 'max-h-96 opacity-100 scale-y-100'
            : 'max-h-0 opacity-0 scale-y-95'
        }`}
      >
        {children.map((item) => (
          <SidebarMenuItem key={item.url} className="pl-6">
            <SidebarMenuButton isActive={pathname.startsWith(item.url)} asChild>
              <Link
                to={item.url}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-opacity duration-200"
              >
                <span
                  className={`w-2 h-2 rotate-45 ${stageColorMap[item.stage]}`}
                />
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </div>
    </SidebarMenu>
  );
};
