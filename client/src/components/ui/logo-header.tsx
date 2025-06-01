import { twMerge } from 'tailwind-merge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
  '3xl': 'text-6xl',
};

export const LogoHeader = ({
  size = '2xl',
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
    <div className={twMerge('flex flex-col gap-1', className)}>
      <h1
        className={twMerge(
          'overflow-hidden whitespace-nowrap pr-5 font-bold text-primary',
          textSizes[size],
          'animate-typing',
        )}
      >
        Bittt.
      </h1>
    </div>
  );
};
