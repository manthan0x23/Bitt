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
  MdLeaderboard,
  MdOutlineLeaderboard,
  MdOutlineSettings,
  MdSettings,
  MdOutlineWorkOutline,
  MdOutlineWork,
} from 'react-icons/md';
import {
  IoWallet,
  IoWalletOutline,
  IoChatbubbleOutline,
  IoChatbubbleSharp,
} from 'react-icons/io5';
import { RiServerFill, RiServerLine } from 'react-icons/ri';
import type { IconType } from 'react-icons/lib';
import { TbInnerShadowTopFilled } from 'react-icons/tb';
import { SideBarGroupMain } from './group-main';
import { SideBarGroupSecondary } from './group-secondary';

interface SideBarButton {
  title: string;
  icon: IconType;
  icon_line: IconType;
  url: string;
}

const document: SideBarButton[] = [
  {
    title: 'Billing',
    icon_line: IoWalletOutline,
    icon: IoWallet,
    url: '/admin/billing',
  },
  {
    title: 'Settings',
    icon_line: MdOutlineSettings,
    icon: MdSettings,
    url: '/admin/settings',
  },
];

const application: SideBarButton[] = [
  {
    title: 'Dashboard',
    icon_line: GoHome,
    icon: GoHomeFill,
    url: '/admin',
  },
  {
    title: 'Jobs Posted',
    icon_line: MdOutlineWorkOutline,
    icon: MdOutlineWork,
    url: '/admin/jobs',
  },
  {
    title: 'Contests',
    icon_line: MdOutlineLeaderboard,
    icon: MdLeaderboard,
    url: '/admin/contests',
  },
  {
    title: 'Judge System',
    icon_line: RiServerLine,
    icon: RiServerFill,
    url: '/admin/judge',
  },
  {
    title: 'Messages',
    icon_line: IoChatbubbleOutline,
    icon: IoChatbubbleSharp,
    url: '/admin/messages',
  },
];

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
        <SideBarGroupMain items={application} />
        <SideBarGroupSecondary items={document} />
      </SidebarContent>
    </Sidebar>
  );
};
