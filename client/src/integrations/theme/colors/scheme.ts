import { z } from 'zod';

export const colorSchemeEnum = z.enum([
  'gray', // default / neutral
  'blue', // info / primary
  'green', // success
  'red', // danger / error
  'pink', // playful / accent
  'orange', // warning
  'yellow', // caution
  'purple', // creativity / secondary
  'teal', // alternative success
  'indigo', // highlight
]);

export type ColorSchemeEnum = z.infer<typeof colorSchemeEnum>;

export const colorSchemeBgClassMap: Record<string, string> = {
  gray: 'bg-gray-500 dark:bg-accent-foreground',
  blue: 'bg-blue-500 dark:bg-accent-foreground',
  green: 'bg-green-500 dark:bg-accent-foreground',
  red: 'bg-red-500 dark:bg-accent-foreground',
  pink: 'bg-pink-500 dark:bg-accent-foreground',
  orange: 'bg-orange-500 dark:bg-accent-foreground',
  yellow: 'bg-yellow-500 dark:bg-accent-foreground',
  purple: 'bg-purple-500 dark:bg-accent-foreground',
  teal: 'bg-teal-500 dark:bg-accent-foreground',
  indigo: 'bg-indigo-500 dark:bg-accent-foreground',
};
