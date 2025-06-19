import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Home,
  CreditCard,
  Users,
  UserPlus,
  Shield,
  Building,
  ExternalLink,
} from 'lucide-react';

const menu = [
  {
    heading: 'General',
    items: [
      {
        main: true,
        label: 'Organization Info',
        icon: Building,
        url: '/admin/organization/',
      },
      {
        main: false,
        label: 'Members',
        icon: Users,
        url: '/admin/organization/members',
      },
      {
        main: false,
        label: 'Roles',
        icon: Shield,
        url: '/admin/organization/roles',
      },
      {
        main: false,
        label: 'Invites',
        icon: UserPlus,
        url: '/admin/organization/invites',
      },
    ],
  },
  {
    heading: 'External',
    items: [
      {
        main: false,
        label: 'Billing',
        icon: CreditCard,
        url: '/admin/billing',
      },
      { main: false, label: 'Home', icon: Home, url: '/admin' },
    ],
  },
];

export const OrganizationSettingsSidePannel = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-full h-full py-3 pl-2 flex flex-col justify-between items-start">
      <ul className="space-y-1 w-full">
        {menu[0].items.map(({ main, label, icon: Icon, url }) => {
          const isActive = main
            ? pathname === '/admin/organization' ||
              pathname === '/admin/organization/'
            : pathname.startsWith(url);

          return (
            <li
              key={label}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
                isActive
                  ? 'bg-primary text-accent dark:text-accent-foreground font-medium'
                  : 'hover:bg-muted',
              )}
            >
              <Link
                to={url}
                className="text-sm flex justify-start gap-2 w-full items-center h-full"
              >
                <Icon
                  size={16}
                  className={cn(
                    'transition-colors',
                    isActive
                      ? 'text-accent dark:text-accent-foreground'
                      : 'text-muted-foreground',
                  )}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="space-y-1 w-full">
        <p className="text-sm text-muted-foreground font-medium">Application</p>
        {menu[1].items.map(({ label, icon: Icon, url }) => (
          <li
            key={label}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm  hover:bg-muted transition-colors cursor-pointer',
            )}
          >
            <Link to={url} className="text-sm flex justify-between w-full">
              <span className="flex justify-start gap-2 items-center">
                <Icon size={16} className="text-muted-foreground" />
                <span>{label}</span>
              </span>
              <ExternalLink size={16} className="text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
