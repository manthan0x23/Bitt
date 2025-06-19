import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { GoHomeFill } from 'react-icons/go';
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
            { title: 'Dashboard', url: '/admin', icon: GoHomeFill },
            { title: 'Jobs Posted', url: '/admin/jobs', icon: MdOutlineWork },
            { title: 'Tasks', url: '/admin/tasks', icon: MdTask },
            { title: 'Judge System', url: '/admin/judge', icon: RiServerFill },
          ]}
        />
        {/* Management Group */}
        <SideBarGroupGeneral
          title="Management"
          items={[
            {
              title: 'Calendar',
              url: '/admin/calendar',
              icon: MdCalendarMonth,
            },
            {
              title: 'Messages',
              url: '/admin/messages',
              icon: IoChatbubbleSharp,
            },
            {
              title: 'Organization',
              url: '/admin/organization/',
              icon: MdSettings,
            },
          ]}
        />

        {/* Organization Group */}
        <SideBarGroupGeneral
          title="Organization"
          items={[
            { title: 'Billing', url: '/admin/billing', icon: IoWallet },
            { title: 'Account', url: '/admin/account', icon: MdPerson },
          ]}
        />
      </SidebarContent>
    </Sidebar>
  );
};
