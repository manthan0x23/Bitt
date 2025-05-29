import type React from 'react'
import { Spinner } from '@/components/ui/spinner'

export const GlobalLoadingPage = ({
  isLoading = false,
  children,
}: {
  isLoading?: boolean
  children: React.ReactNode
}) => {
  if (isLoading) {
    return (
      <div className="screen-full relative">
        <div className="z-10 screen-full absolute cursor-not-allowed bg-white/40 flex items-center justify-center">
          {/* <Spinner /> */}
        </div>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
