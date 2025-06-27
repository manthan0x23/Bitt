import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { GoHome, GoHomeFill } from 'react-icons/go';
import {
  MdOutlineWork,
  MdTask,
  MdCalendarMonth,
  MdSettings,
  MdPerson,
} from 'react-icons/md';
import { IoChatbubbleSharp, IoWallet } from 'react-icons/io5';
import { RiServerFill } from 'react-icons/ri';
import { TbInnerShadowTopFilled } from 'react-icons/tb';
import { SideBarGroupGeneral } from './group-general';
import { SideBarGroupMain } from './group-main';
import { LuShapes } from "react-icons/lu";
import { Calendar, Home, LampDesk, ListChecks, MailOpen, MessagesSquare, PersonStanding, Server, Settings, Shapes, User, Wallet } from 'lucide-react';

export const SideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <TbInnerShadowTopFilled className="!size-5" />
                <span className="text-base font-semibold">Bittt.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Platform Group */}
        <SideBarGroupMain
          items={[
            { title: 'Dashboard', url: '/admin', icon: Home },
            { title: 'Jobs Posted', url: '/admin/jobs', icon: LampDesk },
            { title: 'Tasks', url: '/admin/tasks', icon: ListChecks  },
            { title: 'Judge System', url: '/admin/judge', icon: Server },
            { title: 'Playground', url: '/admin/playground', icon: Shapes },
          ]}
        />
        {/* Management Group */}
        <SideBarGroupGeneral
          title="Management"
          items={[
            {
              title: 'Calendar',
              url: '/admin/calendar',
              icon: Calendar,
            },
            {
              title: 'Messages',
              url: '/admin/messages',
              icon: MailOpen,
            },
            {
              title: 'Organization',
              url: '/admin/organization/',
              icon: Settings,
            },
          ]}
        />

        {/* Organization Group */}
        <SideBarGroupGeneral
          title="Organization"
          items={[
            { title: 'Billing', url: '/admin/billing', icon: Wallet },
            { title: 'Account', url: '/admin/account', icon: User },
          ]}
        />
      </SidebarContent>
    </Sidebar>
  );
};
