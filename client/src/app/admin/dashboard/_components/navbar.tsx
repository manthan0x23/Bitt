import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitch } from '@/integrations/theme/theme-switch';
import { authStore } from '@/store/authStore';
import { useStore } from '@tanstack/react-store';
import { IoNotificationsOutline } from 'react-icons/io5';

export const NavBar = () => {
  const { user } = useStore(authStore);

  return (
    <nav className="h-[5%] w-full flex justify-between items-center pr-8">
      <div className="h-full w-auto flex items-center justify-start">
        <SidebarTrigger size={'lg'} className="cursor-pointer" />
      </div>
      <div className="w-auto h-full flex items-center justify-end gap-2 p-0">
        <ThemeSwitch />
        <Button
          className="cursor-pointer rounded-full p-0 "
          size={'default'}
          variant={'ghost'}
        >
          <IoNotificationsOutline size={26} />
        </Button>
        <Avatar>
          <AvatarImage sizes={''} src={user?.picture!} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};
