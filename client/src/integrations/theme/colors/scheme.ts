import { z } from 'zod/v4';

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

export const colorSchemeBgClassMap: Record<ColorSchemeEnum, string> = {
  gray: 'bg-gray-500 dark:bg-gray-600',
  blue: 'bg-blue-500 dark:bg-blue-600',
  green: 'bg-green-500 dark:bg-green-600',
  red: 'bg-red-500 dark:bg-red-600',
  pink: 'bg-pink-500 dark:bg-pink-600',
  orange: 'bg-orange-500 dark:bg-orange-600',
  yellow: 'bg-yellow-500 dark:bg-yellow-600',
  purple: 'bg-purple-500 dark:bg-purple-600',
  teal: 'bg-teal-500 dark:bg-teal-600',
  indigo: 'bg-indigo-500 dark:bg-indigo-600',
};
