import { twMerge } from 'tailwind-merge'

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
  '3xl': 'text-6xl',
}

export const LogoHeader = ({
  size = '2xl',
  className,
}: {
  size?: keyof typeof textSizes
  className?: string
}) => {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>
      <h1
        className={twMerge(
          'animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-black font-bold',
          textSizes[size],
        )}
      >
        Bittt.
      </h1>
    </div>
  )
}
