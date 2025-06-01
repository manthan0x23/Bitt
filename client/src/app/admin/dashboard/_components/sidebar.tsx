import { LogoHeader } from '@/components/ui/logo-header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authStore';
import { GoHome, GoHomeFill } from 'react-icons/go';
import {
  MdLeaderboard,
  MdBugReport,
  MdOutlineLeaderboard,
  MdOutlineBugReport,
  MdOutlineSettings,
  MdSettings,
} from 'react-icons/md';
import { IoWallet, IoWalletOutline } from 'react-icons/io5';
import { RiServerFill, RiServerLine } from 'react-icons/ri';
import { IoChatbubbleOutline, IoChatbubbleSharp } from 'react-icons/io5';

const items = [
  {
    title: 'Dashboard',
    icon_line: GoHome,
    icon_fill: GoHomeFill,
    url: '/admin',
  },
  {
    title: 'Contests',
    icon_line: MdOutlineLeaderboard,
    icon_fill: MdLeaderboard,
    url: '/admin/contests',
  },
  {
    title: 'Judge System',
    icon_line: RiServerLine,
    icon_fill: RiServerFill,
    url: '/admin/judge',
  },
  {
    title: 'Messages',
    icon_line: IoChatbubbleOutline,
    icon_fill: IoChatbubbleSharp,
    url: '/admin/messages',
  },
  {
    title: 'Billing',
    icon_line: IoWalletOutline,
    icon_fill: IoWallet,
    url: '/admin/billing',
  },
  {
    title: 'Settings',
    icon_line: MdOutlineSettings,
    icon_fill: MdSettings,
    url: '/admin/settings',
  },
];

export const SideBar = () => {
  const { open, setOpen } = useSidebar();
  const { user } = useStore(authStore);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <Sidebar className="border-none " collapsible="icon">
      <SidebarHeader className="bg-accent">
        <LogoHeader size="xl" collapsed={!open} img={user?.picture} />
      </SidebarHeader>

      <SidebarContent className="bg-accent">
        <SidebarMenu className="h-[80%] flex flex-col justify-center items-center gap-5 ">
          {items.map(({ title, icon_line: Icon, icon_fill: IconFill, url }) => (
            <SidebarMenuItem key={title} className="hover:bg-secondary">
              <Tooltip delayDuration={500}>
                <TooltipTrigger>
                  <Link to={url} className="w-full ">
                    {location.pathname == url ? (
                      <IconFill className="text-2xl  " />
                    ) : (
                      <Icon className="text-2xl text-accent-foreground" />
                    )}
                  </Link>
                </TooltipTrigger>
                {!open && <TooltipContent side="right">{title}</TooltipContent>}
              </Tooltip>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-accent" />
    </Sidebar>
  );
};
