import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useLocation } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { FaCirclePlus } from 'react-icons/fa6';
import type { IconType } from 'react-icons/lib';
import { SideBarDropdownGroup } from './group-dropdown';
import { MdLayers, MdOutlineLayers } from 'react-icons/md';

export function SideBarGroupMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: IconType;
  }[];
}) {
  const { pathname } = useLocation();

  const toggleCreateJob = () => {
    window.location.assign('/admin/jobs/create');
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              onClick={toggleCreateJob}
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
            >
              <FaCirclePlus />
              <span>Quick Create Job</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={
                  item.title == 'Dashboard'
                    ? (location.pathname == '/admin' ||
                      location.pathname == '/admin/')
                    : pathname.startsWith(item.url)
                }
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
          <SideBarDropdownGroup
            title="Stages"
            icon={MdLayers}
            icon_line={MdOutlineLayers}
            url="/admin/stages/"
            children={[
              { title: 'Interviews', url: '/admin/stages/interviews' },
              { title: 'Contests', url: '/admin/stages/contests' },
              { title: 'Quizzes', url: '/admin/stages/quizzes' },
              {
                title: 'Resume Filters',
                url: '/admin/stages/resume-filters',
              },
            ]}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
