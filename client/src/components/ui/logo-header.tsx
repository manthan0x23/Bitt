import { twMerge } from 'tailwind-merge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TbInnerShadowTopFilled } from 'react-icons/tb';
import { ThemeSwitch } from '@/integrations/theme/theme-switch';

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-normal',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export const LogoHeader = ({
  size = 'sm',
  collapsed = false,
  className,
  img,
}: {
  size?: keyof typeof textSizes;
  className?: string;
  collapsed?: boolean;
  img?: string | null;
}) => {
  if (collapsed) {
    return (
      <Avatar>
        {img && <AvatarImage src={img} alt="Logo" />}
        <AvatarFallback>
          <div
            className={twMerge(
              'flex items-center justify-center w-10 h-10 bg-white/70 backdrop-blur border border-gray-200 rounded-xl',
              className,
            )}
          >
            <p className="text-sm text-primary font-semibold tracking-tight">
              01.
            </p>
          </div>
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <>
      <div className="data-[slot=sidebar-menu-button]:!p-1.5 absolute top-0 left-0 m-10">
        <a href="/" className="text-2xl flex gap-2 items-center justify-center">
          <TbInnerShadowTopFilled className="" />
          <span className=" font-semibold">Bittt.</span>
        </a>
      </div>
      <ThemeSwitch className="absolute top-0 right-0 m-10" />
    </>
  );
};
