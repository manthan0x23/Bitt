import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Env = {
  server_url: import.meta.env.VITE_SERVER_API_ENDPOINT,
}
